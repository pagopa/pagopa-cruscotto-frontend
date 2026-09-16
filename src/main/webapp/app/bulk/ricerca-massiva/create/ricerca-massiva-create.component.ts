import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, finalize, forkJoin, merge } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import SharedModule from '../../../shared/shared.module';
import {
  AnagIntermediarioPa,
  AnagIntermediarioPsp,
  AnagCanale,
  AnagPaEmittente,
  AnagPsp,
  AnagStazione,
  PaymentOutcome,
  SearchInstanceDTO,
} from '../../models/bulk-search.model';
import { BulkLookupService } from '../../services/bulk-lookup.service';
import { BulkSearchService } from '../../services/bulk-search.service';
import { RicercaMassivaCreateFormGroup, RicercaMassivaCreateFormService } from './ricerca-massiva-create-form.service';

@Component({
  selector: 'jhi-ricerca-massiva-create',
  templateUrl: './ricerca-massiva-create.component.html',
  styleUrls: ['./ricerca-massiva-create.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    NgxSpinnerModule,
  ],
})
export class RicercaMassivaCreateComponent implements OnInit, OnDestroy {
  readonly paymentOutcomes: PaymentOutcome[] = ['OK', 'KO', 'NONE'];

  editForm: RicercaMassivaCreateFormGroup;

  isSaving = false;
  isLoadingDetail = false;
  isDownloadingCsv = false;
  submitError = false;

  touchpoints: string[] = [];
  paymentMethods: string[] = [];
  creditorInstitutions: AnagPaEmittente[] = [];
  psp: AnagPsp[] = [];
  intermediaries: AnagIntermediarioPa[] = [];
  intermediariesPsp: AnagIntermediarioPsp[] = [];
  stations: AnagStazione[] = [];
  channels: AnagCanale[] = [];

  private readonly formService = inject(RicercaMassivaCreateFormService);
  private readonly bulkLookupService = inject(BulkLookupService);
  private readonly bulkSearchService = inject(BulkSearchService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute, { optional: true });
  private readonly spinner = inject(NgxSpinnerService);

  private readonly subscriptions = new Subscription();

  private readonly duplicateInstance: SearchInstanceDTO | null;
  private readonly detailInstance: SearchInstanceDTO | null;
  detailInstanceId: string | null = null;
  detailInstanceStatus: string | null = null;
  isReadOnly = false;

  constructor() {
    this.editForm = this.formService.createFormGroup();
    const navigationState = this.router.getCurrentNavigation?.()?.extras.state as
      | {
          duplicateInstance?: SearchInstanceDTO;
          detailInstance?: SearchInstanceDTO;
        }
      | undefined;
    this.duplicateInstance = navigationState?.duplicateInstance ?? null;
    this.detailInstance = this.activatedRoute?.snapshot.data['detailInstance'] ?? navigationState?.detailInstance ?? null;
    this.detailInstanceId = this.detailInstance?.id ?? null;
    this.detailInstanceStatus = this.detailInstance?.status ?? null;
  }

  ngOnInit(): void {
    // Le stazioni disponibili dipendono dal PSP e dall'intermediario selezionati.
    this.subscriptions.add(
      merge(this.editForm.controls.psp.valueChanges, this.editForm.controls.intermediary.valueChanges).subscribe(() => {
        this.editForm.controls.station.setValue(null);
        this.loadStations();
      }),
    );

    this.loadLookups();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  displayCodeDescription = (value: { codice?: string; description?: string } | null): string =>
    value ? [value.codice, value.description].filter(Boolean).join(' - ') : '';

  displayStation = (value: AnagStazione | null): string => value?.codice ?? '';

  clearFilter(controlName: string): void {
    if (this.isReadOnly) {
      return;
    }
    this.editForm.get(controlName)?.setValue(null);
  }

  downloadCsv(): void {
    if (!this.detailInstanceId || this.isLoadingDetail || this.isDownloadingCsv) {
      return;
    }

    this.isDownloadingCsv = true;
    void this.spinner.show('download-spinner');
    this.subscriptions.add(
      this.bulkSearchService
        .downloadCsv(this.detailInstanceId)
        .pipe(
          finalize(() => {
            this.isDownloadingCsv = false;
            void this.spinner.hide('download-spinner');
          }),
        )
        .subscribe(blob => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${this.detailInstance?.name ?? 'ricerca-massiva'}.csv`;
          link.click();
          URL.revokeObjectURL(url);
        }),
    );
  }

  previousState(): void {
    if (this.isLoadingDetail || this.isSaving) {
      return;
    }
    void this.router.navigate(['/bulk/ricerca-massiva']);
  }

  save(): void {
    if (this.isReadOnly || this.isLoadingDetail || this.isSaving) {
      return;
    }

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.submitError = false;
    this.isSaving = true;
    void this.spinner.show('isSaving');

    const searchInstance = this.formService.getSearchInstance(this.editForm);
    if (this.detailInstance?.inputType?.toUpperCase() === 'FILTER') {
      searchInstance.inputType = 'FILTER';
    }

    const saveRequest = this.detailInstance?.id
      ? this.bulkSearchService.update(this.detailInstance.id, {
          ...searchInstance,
          id: this.detailInstance.id,
          status: this.detailInstance.status,
          createdAt: this.detailInstance.createdAt,
          updatedAt: this.detailInstance.updatedAt,
        })
      : this.bulkSearchService.create(searchInstance);

    this.subscriptions.add(
      saveRequest.subscribe({
        next: () => this.onSaveSuccess(),
        error: () => this.onSaveError(),
      }),
    );
  }

  private onSaveSuccess(): void {
    this.onSaveFinalize();
    this.previousState();
  }

  private onSaveError(): void {
    this.onSaveFinalize();
    this.submitError = true;
  }

  private onSaveFinalize(): void {
    this.isSaving = false;
    void this.spinner.hide('isSaving');
  }

  private loadLookups(): void {
    const request = { page: 0, size: 20 };
    this.isLoadingDetail = true;
    void this.spinner.show('isLoadingDetail');
    this.subscriptions.add(
      forkJoin({
        touchpoints: this.bulkLookupService.touchpoints(request),
        paymentMethods: this.bulkLookupService.paymentMethods(request),
        creditorInstitutions: this.bulkLookupService.creditorInstitutions(request),
        psp: this.bulkLookupService.psp(request),
        intermediaries: this.bulkLookupService.intermediaries(request),
        intermediariesPsp: this.bulkLookupService.intermediariesPsp(request),
        stations: this.bulkLookupService.stations(request),
        channels: this.bulkLookupService.channels(request),
      })
        .pipe(
          finalize(() => {
            this.isLoadingDetail = false;
            void this.spinner.hide('isLoadingDetail');
          }),
        )
        .subscribe(lookups => {
          this.touchpoints = lookups.touchpoints.content ?? [];
          this.paymentMethods = lookups.paymentMethods.content ?? [];
          this.creditorInstitutions = lookups.creditorInstitutions.content ?? [];
          this.psp = lookups.psp.content ?? [];
          this.intermediaries = lookups.intermediaries.content ?? [];
          this.intermediariesPsp = lookups.intermediariesPsp.content ?? [];
          this.stations = lookups.stations.content ?? [];
          this.channels = lookups.channels.content ?? [];

          const instanceToLoad = this.detailInstance ?? this.duplicateInstance;
          if (instanceToLoad) {
            this.formService.patchFromSearchInstance(this.editForm, instanceToLoad, {
              creditorInstitutions: this.creditorInstitutions,
              psp: this.psp,
              intermediaries: this.intermediaries,
              intermediariesPsp: this.intermediariesPsp,
              stations: this.stations,
              channels: this.channels,
            });
          }

          if (this.detailInstance) {
            this.isReadOnly = this.detailInstance.status !== 'DRAFT';
            if (this.isReadOnly) {
              this.editForm.disable();
            }
          }
        }),
    );
  }

  private loadStations(): void {
    this.subscriptions.add(
      this.bulkLookupService.stations({ page: 0, size: 20 }).subscribe(page => {
        this.stations = page.content ?? [];
      }),
    );
  }
}
