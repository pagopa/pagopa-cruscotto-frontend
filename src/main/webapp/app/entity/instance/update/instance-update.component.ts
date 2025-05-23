import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IInstance } from '../models/instance.model';
import { InstanceService } from '../service/instance.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { PartnerSelectComponent } from '../../partner/shared/partner-select/partner-select.component';
import { InstanceFormGroup, InstanceFormService } from './instance-form.service';
import dayjs from 'dayjs/esm';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePickerFormatDirective } from '../../../shared/date/date-picker-format.directive';

/* eslint-disable no-console */

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'jhi-instance-update',
  templateUrl: './instance-update.component.html',
  imports: [
    SharedModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    NgxSpinnerModule,
    RouterModule,
    MatDatepickerModule,
    PartnerSelectComponent,
    DatePickerFormatDirective,
  ],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
})
export class InstanceUpdateComponent implements OnInit {
  isSaving = false;
  instance: IInstance | null = null;
  minDateFrom = dayjs().add(1, 'day');
  locale: string;

  private readonly instanceService = inject(InstanceService);
  private readonly instanceFormService = inject(InstanceFormService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly translateService = inject(TranslateService);

  editForm: InstanceFormGroup = this.instanceFormService.createInstanceFormGroup();

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ instance }) => {
      this.instance = instance;
      if (instance) {
        this.updateForm(instance);
      }

      Object.keys(this.editForm.controls).forEach(field => {
        const control = this.editForm.get(field);
        if (control !== null) control.markAsTouched({ onlySelf: true });
      });
    });

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  updateForm(instance: IInstance): void {
    this.instance = instance;
    this.instanceFormService.resetForm(this.editForm, instance);
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.spinner.show('isSaving').then(() => {
      this.isSaving = true;
    });
    const instance = this.instanceFormService.getInstance(this.editForm);

    if (instance.id !== null) {
      this.subscribeToSaveResponse(this.instanceService.update(instance));
    } else {
      this.subscribeToSaveResponse(this.instanceService.create(instance));
    }
  }

  clearDate(...ctrlNames: string[]): void {
    ctrlNames.forEach(ctrlName => this.editForm.get(ctrlName)?.setValue(null));
  }

  predictedDateAnalysisValidator = (d: dayjs.Dayjs | null): boolean => {
    const result = d ? d > dayjs() : false;

    if (result) {
      const analysisPeriodStartDateControl = this.editForm.get('analysisPeriodStartDate');
      const analysisPeriodEndDateControl = this.editForm.get('analysisPeriodEndDate');
      analysisPeriodStartDateControl?.updateValueAndValidity();
      analysisPeriodEndDateControl?.updateValueAndValidity();
    }

    return result;
  };

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInstance>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {}

  protected onSaveFinalize(): void {
    this.spinner.hide('isSaving').then(() => {
      this.isSaving = false;
    });
  }

  /**
   * Imposta il primo giorno del mese selezionato (`Start Month`).
   * @param selected Mese selezionato
   * @param picker Riferimento al MatDatepicker
   */
  selectStartMonth(selected: dayjs.Dayjs, picker: any): void {
    const firstDayOfMonth = selected.startOf('month');
    this.editForm.get('analysisPeriodStartDate')!.setValue(firstDayOfMonth);
    picker.close();
  }

  /**
   * Imposta l'ultimo giorno del mese selezionato (`End Month`).
   * @param selected Mese selezionato
   * @param picker Riferimento al MatDatepicker
   */
  selectEndMonth(selected: dayjs.Dayjs, picker: any): void {
    const lastDayOfMonth = selected.endOf('month');
    this.editForm.get('analysisPeriodEndDate')!.setValue(lastDayOfMonth);
    picker.close();
  }

  // Filtro per disabilitare mesi successivi alla data prevista (campo "Mese inizio periodo")
  startMonthFilter = (date: dayjs.Dayjs | null): boolean => {
    const endDate =
      this.editForm.get('predictedDateAnalysis')?.value || this.editForm.get('analysisPeriodEndDate')?.value || dayjs().add(5, 'year');

    // Consente la selezione se:
    // 1. La data (inizio) è uguale o precedente alla data prevista
    return date ? date.isBefore(endDate, 'month') : true;
  };

  // Filtro per disabilitare mesi successivi alla data prevista nel campo "Mese fine periodo"
  endMonthFilter = (date: dayjs.Dayjs | null): boolean => {
    const predictedDateAnalysis = this.editForm.get('predictedDateAnalysis')?.value || dayjs().add(5, 'year');
    const startMonth = this.editForm.get('analysisPeriodStartDate')?.value || dayjs().add(-5, 'year');

    return date
      ? date.isBefore(predictedDateAnalysis, 'month') &&
          (startMonth ? date.isSame(startMonth, 'month') || date.isAfter(startMonth, 'month') : true)
      : true;
  };
}
