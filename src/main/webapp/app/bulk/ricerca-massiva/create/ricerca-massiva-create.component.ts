import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription, map, merge, of, startWith } from 'rxjs';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
  AnagPaEmittente,
  AnagPsp,
  AnagStazione,
  PaymentOutcome,
  SearchInstanceDTO,
} from '../../models/bulk-search.model';
import { BulkSearchService } from '../../services/bulk-search.service';
import { RICERCA_MASSIVA_LOOKUPS } from '../ricerca-massiva.mock';
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
    MatAutocompleteModule,
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
  submitError = false;

  filteredTouchpoints$: Observable<string[]> = of([]);
  filteredPaymentMethods$: Observable<string[]> = of([]);
  filteredCreditorInstitutions$: Observable<AnagPaEmittente[]> = of([]);
  filteredPsp$: Observable<AnagPsp[]> = of([]);
  filteredIntermediaries$: Observable<AnagIntermediarioPa[]> = of([]);
  filteredStations$: Observable<AnagStazione[]> = of([]);

  private touchpoints: string[] = [];
  private paymentMethods: string[] = [];
  private creditorInstitutions: AnagPaEmittente[] = [];
  private psp: AnagPsp[] = [];
  private intermediaries: AnagIntermediarioPa[] = [];
  private stations: AnagStazione[] = [];

  private readonly formService = inject(RicercaMassivaCreateFormService);
  private readonly bulkSearchService = inject(BulkSearchService);
  private readonly router = inject(Router);
  private readonly spinner = inject(NgxSpinnerService);

  private readonly subscriptions = new Subscription();

  private readonly duplicateInstance: SearchInstanceDTO | null;

  constructor() {
    this.editForm = this.formService.createFormGroup();
    const navigationState = this.router.getCurrentNavigation?.()?.extras.state as { duplicateInstance?: SearchInstanceDTO } | undefined;
    this.duplicateInstance = navigationState?.duplicateInstance ?? null;
  }

  ngOnInit(): void {
    this.loadTouchpoints();
    this.loadPaymentMethods();
    this.loadCreditorInstitutions();
    this.loadPsp();
    this.loadIntermediaries();
    this.loadStations();

    if (this.duplicateInstance) {
      this.formService.patchFromSearchInstance(this.editForm, this.duplicateInstance, {
        creditorInstitutions: this.creditorInstitutions,
        psp: this.psp,
        intermediaries: this.intermediaries,
        stations: this.stations,
      });
    }

    // Le stazioni disponibili dipendono dal PSP e dall'intermediario selezionati.
    this.subscriptions.add(
      merge(this.editForm.controls.psp.valueChanges, this.editForm.controls.intermediary.valueChanges).subscribe(() => {
        this.editForm.controls.station.setValue(null);
        this.loadStations();
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  displayCodeDescription = (value: { codice?: string; description?: string } | null): string =>
    value ? [value.codice, value.description].filter(Boolean).join(' - ') : '';

  displayStation = (value: AnagStazione | null): string => value?.codice ?? '';

  previousState(): void {
    void this.router.navigate(['/bulk/ricerca-massiva']);
  }

  save(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.submitError = false;
    this.spinner.show('isSaving').then(() => {
      this.isSaving = true;
    });

    const searchInstance = this.formService.getSearchInstance(this.editForm);

    this.subscriptions.add(
      this.bulkSearchService.create(searchInstance).subscribe({
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
    this.spinner.hide('isSaving').then(() => {
      this.isSaving = false;
    });
  }

  // TODO: sostituire con una ricerca server-side quando l'endpoint supporterà un parametro testuale.
  private loadTouchpoints(): void {
    of(RICERCA_MASSIVA_LOOKUPS.touchpoints).subscribe(page => {
      this.touchpoints = page.content ?? [];
      this.filteredTouchpoints$ = this.editForm.controls.touchpoint.valueChanges.pipe(
        startWith(''),
        map(value => this.filterStrings(this.touchpoints, value)),
      );
    });
  }

  // TODO: sostituire con una ricerca server-side quando l'endpoint supporterà un parametro testuale.
  private loadPaymentMethods(): void {
    of(RICERCA_MASSIVA_LOOKUPS.paymentMethods).subscribe(page => {
      this.paymentMethods = page.content ?? [];
      this.filteredPaymentMethods$ = this.editForm.controls.paymentMethod.valueChanges.pipe(
        startWith(''),
        map(value => this.filterStrings(this.paymentMethods, value)),
      );
    });
  }

  // TODO: sostituire con una ricerca server-side quando l'endpoint supporterà un parametro testuale.
  private loadCreditorInstitutions(): void {
    of(RICERCA_MASSIVA_LOOKUPS.creditorInstitutions).subscribe(page => {
      this.creditorInstitutions = page.content ?? [];
      this.filteredCreditorInstitutions$ = this.editForm.controls.creditorInstitution.valueChanges.pipe(
        startWith(''),
        map(value => this.filterCodeDescription(this.creditorInstitutions, value)),
      );
    });
  }

  // TODO: sostituire con una ricerca server-side quando l'endpoint supporterà un parametro testuale.
  private loadPsp(): void {
    of(RICERCA_MASSIVA_LOOKUPS.psp).subscribe(page => {
      this.psp = page.content ?? [];
      this.filteredPsp$ = this.editForm.controls.psp.valueChanges.pipe(
        startWith(''),
        map(value => this.filterCodeDescription(this.psp, value)),
      );
    });
  }

  // TODO: sostituire con una ricerca server-side quando l'endpoint supporterà un parametro testuale.
  private loadIntermediaries(): void {
    of(RICERCA_MASSIVA_LOOKUPS.intermediaries).subscribe(page => {
      this.intermediaries = page.content ?? [];
      this.filteredIntermediaries$ = this.editForm.controls.intermediary.valueChanges.pipe(
        startWith(''),
        map(value => this.filterCodeDescription(this.intermediaries, value)),
      );
    });
  }

  // TODO: filtrare le stazioni lato server in base a pspId/intermediaryId quando l'endpoint lo supporterà.
  private loadStations(): void {
    of(RICERCA_MASSIVA_LOOKUPS.stations).subscribe(page => {
      this.stations = page.content ?? [];
      this.filteredStations$ = this.editForm.controls.station.valueChanges.pipe(
        startWith(''),
        map(value => this.filterStations(this.stations, value)),
      );
    });
  }

  private filterStrings(options: string[], value: string | null): string[] {
    const filterValue = (value ?? '').toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private filterStations(options: AnagStazione[], value: AnagStazione | string | null): AnagStazione[] {
    const filterValue = (typeof value === 'string' ? value : (value?.codice ?? '')).toLowerCase();
    return options.filter(option => (option.codice ?? '').toLowerCase().includes(filterValue));
  }

  private filterCodeDescription<T extends { codice?: string; description?: string }>(options: T[], value: T | string | null): T[] {
    const filterValue = (typeof value === 'string' ? value : this.displayCodeDescription(value)).toLowerCase();
    return options.filter(option => this.displayCodeDescription(option).toLowerCase().includes(filterValue));
  }
}
