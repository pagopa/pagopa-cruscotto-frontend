import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, finalize, forkJoin } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import SharedModule from '../../../shared/shared.module';
import { BulkLookupSelectComponent } from '../../shared/bulk-lookup-select/bulk-lookup-select.component';
import {
  PaymentOutcome,
  SelectedReportsValues,
  SearchInstanceDTO,
  SearchInstanceExecutionDTO,
  LookupOption,
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
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    MatTimepickerModule,
    NgxSpinnerModule,
    BulkLookupSelectComponent,
  ],
})
export class RicercaMassivaCreateComponent implements OnInit, OnDestroy {
  readonly paymentOutcomes: PaymentOutcome[] = ['OK', 'KO', 'NONE'];
  readonly selectedReportsValues: SelectedReportsValues[] = ['POSITION', 'TOKEN', 'TRANSFER'];

  editForm: RicercaMassivaCreateFormGroup;

  isSaving = false;
  isLoadingDetail = false;
  isLoadingExecutions = false;
  isDownloadingCsv = false;
  submitError = false;
  executionColumns: string[] = ['id', 'status', 'startedAt', 'endedAt', 'errorCode', 'errorMessage'];
  readonly executionMessagePreviewLength = 120;
  executionRows: SearchInstanceExecutionDTO[] = [];
  touchpoints: LookupOption[] = [];
  paymentMethods: LookupOption[] = [];
  paymentMethodsHasMore = false;
  creditorInstitutions: LookupOption[] = [];
  creditorInstitutionsHasMore = false;
  psp: LookupOption[] = [];
  pspHasMore = false;
  intermediaries: LookupOption[] = [];
  intermediariesHasMore = false;
  intermediariesPsp: LookupOption[] = [];
  intermediariesPspHasMore = false;
  stations: LookupOption[] = [];
  stationsHasMore = false;
  channels: LookupOption[] = [];
  channelsHasMore = false;
  detailInstanceId: string | null = null;
  detailInstanceStatus: string | null = null;
  detailInstanceType: string | null = null;
  isReadOnly = false;
  hasCsv = false;

  private readonly formService = inject(RicercaMassivaCreateFormService);
  private readonly bulkLookupService = inject(BulkLookupService);
  private readonly bulkSearchService = inject(BulkSearchService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute, { optional: true });
  private readonly spinner = inject(NgxSpinnerService);
  private readonly dialog = inject(MatDialog);
  private readonly subscriptions = new Subscription();
  private readonly duplicateInstance: SearchInstanceDTO | null;
  private readonly detailInstance: SearchInstanceDTO | null;

  @ViewChild('fullExecutionMessageDialog') private fullExecutionMessageDialog!: TemplateRef<unknown>;

  constructor() {
    const navigationState = this.router.getCurrentNavigation()?.extras.state as
      | {
          duplicateInstance?: SearchInstanceDTO;
          detailInstance?: SearchInstanceDTO;
        }
      | undefined;
    this.duplicateInstance = navigationState?.duplicateInstance ?? null;
    this.detailInstance = this.activatedRoute?.snapshot.data['detailInstance'] ?? navigationState?.detailInstance ?? null;
    this.detailInstanceId = this.detailInstance?.id ?? null;
    this.detailInstanceStatus = this.detailInstance?.status ?? null;
    this.detailInstanceType = this.detailInstance?.inputType ?? null;
    this.editForm = this.formService.createFormGroup(this.detailInstanceType === 'CSV');
    this.hasCsv = this.detailInstance?.presentCsv ?? false;
    this.subscriptions.add(this.editForm.get('name')!.valueChanges.subscribe(() => this.clearDuplicateNameError()));
  }

  ngOnInit(): void {
    this.loadLookups();
    if (this.detailInstanceId) {
      this.loadExecutions();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  displayCodeDescription = (value: LookupOption | string | null): string =>
    typeof value === 'string' ? value : value ? [value.codice, value.description].filter(Boolean).join(' - ') : '';

  getExecutionMessagePreview(message?: string): string {
    if (!message || message.length <= this.executionMessagePreviewLength) {
      return message ?? '--';
    }

    return `${message.slice(0, this.executionMessagePreviewLength).trimEnd()}...`;
  }

  isExecutionMessageLong(message?: string): boolean {
    return (message?.length ?? 0) > this.executionMessagePreviewLength;
  }

  viewExecutionMessage(message: string): void {
    this.dialog.open(this.fullExecutionMessageDialog, {
      data: message,
      width: '640px',
      maxWidth: '90vw',
    });
  }

  isLookupOption(value: unknown): value is LookupOption {
    return typeof value === 'object' && value !== null;
  }

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
            void this.spinner.hide('download-spincreditorsner');
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
        error: (error: HttpErrorResponse) => this.onSaveError(error),
      }),
    );
  }

  private onSaveSuccess(): void {
    this.onSaveFinalize();
    this.previousState();
  }

  private onSaveError(error: HttpErrorResponse): void {
    this.onSaveFinalize();

    if (error.status === 409 && error.url?.includes('/api/bulk/search-instances') && !error.url.includes('/csv')) {
      this.editForm.get('name')?.setErrors({ duplicateInstanceName: true });
      return;
    }

    this.submitError = true;
  }

  private clearDuplicateNameError(): void {
    const nameControl = this.editForm.get('name');
    if (nameControl?.errors?.duplicateInstanceName) {
      const errors = { ...nameControl.errors };
      delete errors.duplicateInstanceName;
      nameControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
      this.submitError = false;
    }
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
          this.paymentMethodsHasMore = !lookups.paymentMethods.last;
          this.creditorInstitutions = lookups.creditorInstitutions.content ?? [];
          this.creditorInstitutionsHasMore = !lookups.creditorInstitutions.last;
          this.psp = lookups.psp.content ?? [];
          this.pspHasMore = !lookups.psp.last;
          this.intermediaries = lookups.intermediaries.content ?? [];
          this.intermediariesHasMore = !lookups.intermediaries.last;
          this.intermediariesPsp = lookups.intermediariesPsp.content ?? [];
          this.intermediariesPspHasMore = !lookups.intermediariesPsp.last;
          this.stations = lookups.stations.content ?? [];
          this.stationsHasMore = !lookups.stations.last;
          this.channels = lookups.channels.content ?? [];
          this.channelsHasMore = !lookups.channels.last;
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
            this.isReadOnly = !(this.detailInstance.status == 'DRAFT' || this.detailInstance.status == 'FAILED');
            if (this.isReadOnly) {
              this.editForm.disable();
            }
          }
        }),
    );
  }

  private loadExecutions(): void {
    if (!this.detailInstanceId) {
      return;
    }

    this.isLoadingExecutions = true;
    void this.spinner.show('isLoadingExecutions');

    this.subscriptions.add(
      this.bulkSearchService
        .getExecutions(this.detailInstanceId)
        .pipe(
          finalize(() => {
            this.isLoadingExecutions = false;
            void this.spinner.hide('isLoadingExecutions');
          }),
        )
        .subscribe(executions => {
          this.executionRows = executions ?? [];
        }),
    );
  }
}
