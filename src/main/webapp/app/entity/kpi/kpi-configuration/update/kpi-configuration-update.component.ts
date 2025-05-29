import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';

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

import dayjs from 'dayjs/esm';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';

import { IKpiConfiguration } from '../kpi-configuration.model';
import { KpiConfigurationService } from '../service/kpi-configuration.service';
import { KpiConfigurationFormGroup, KpiConfigurationFormService } from './kpi-configuration-form.service';
import { MatSelectModule } from '@angular/material/select';

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
  selector: 'jhi-kpi-configuration-update',
  templateUrl: './kpi-configuration-update.component.html',
  styleUrls: ['./kpi-configuration-update.component.scss'],
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
    MatSelectModule,
  ],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
})
export class KpiConfigurationUpdateComponent implements OnInit {
  isSaving = false;
  kpiConfiguration: IKpiConfiguration | null = null;
  minDateFrom = dayjs().add(1, 'day');
  locale: string;
  booleanOptions: { value: boolean; text: string }[] = [
    { value: true, text: 'values.yes' },
    { value: false, text: 'values.no' },
  ];
  evaluationTypeOptions: { value: string; text: string }[] = [
    { value: 'MESE', text: 'pagopaCruscottoApp.kpiConfiguration.update.evaluationType.month' },
    { value: 'TOTALE', text: 'pagopaCruscottoApp.kpiConfiguration.update.evaluationType.whole' },
  ];

  private readonly kpiConfigurationService = inject(KpiConfigurationService);
  private readonly kpiConfigurationFormService = inject(KpiConfigurationFormService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly translateService = inject(TranslateService);

  editForm: KpiConfigurationFormGroup = this.kpiConfigurationFormService.createKpiConfigurationFormGroup();

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ kpiConfiguration }) => {
      this.kpiConfiguration = kpiConfiguration;
      if (kpiConfiguration) {
        this.updateForm(kpiConfiguration);
      }
    });

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  updateForm(kpiConfiguration: IKpiConfiguration): void {
    this.kpiConfiguration = kpiConfiguration;
    this.kpiConfigurationFormService.resetForm(this.editForm, kpiConfiguration);
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.spinner.show('isSaving').then(() => {
      this.isSaving = true;
    });
    const kpiConfiguration = this.kpiConfigurationFormService.getKpiConfiguration(this.editForm);

    if (kpiConfiguration.id !== null) {
      this.subscribeToSaveResponse(this.kpiConfigurationService.update(kpiConfiguration));
    } else {
      this.subscribeToSaveResponse(this.kpiConfigurationService.create(kpiConfiguration));
    }
  }

  clearDate(...ctrlNames: string[]): void {
    ctrlNames.forEach(ctrlName => this.editForm.get(ctrlName)?.setValue(null));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IKpiConfiguration>>): void {
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
}
