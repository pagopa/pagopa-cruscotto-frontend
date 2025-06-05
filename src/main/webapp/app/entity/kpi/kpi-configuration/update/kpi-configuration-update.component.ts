import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { IKpiConfiguration } from '../kpi-configuration.model';
import { KpiConfigurationService } from '../service/kpi-configuration.service';
import { KpiConfigurationFormGroup, KpiConfigurationFormService } from './kpi-configuration-form.service';
import { MatSelectModule } from '@angular/material/select';
import { ModuleSelectComponent } from '../../../module/shared/module-select/module-select.component';
import { IModule, IModuleConfiguration, ModuleConfiguration } from '../../../module/module.model';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'jhi-kpi-configuration-update',
  templateUrl: './kpi-configuration-update.component.html',
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
    ModuleSelectComponent,
    NgxMaskDirective,
  ],
})
export class KpiConfigurationUpdateComponent implements OnInit {
  isSaving = false;
  kpiConfiguration: IKpiConfiguration | null = null;

  moduleConfiguration: IModuleConfiguration = new ModuleConfiguration();

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
  nullOption = null;

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ kpiConfiguration }) => {
      this.kpiConfiguration = kpiConfiguration;
      if (kpiConfiguration) {
        this.moduleConfiguration = new ModuleConfiguration(kpiConfiguration as IModuleConfiguration);
        this.updateForm(kpiConfiguration);
        this.updateValidationForm(this.moduleConfiguration);
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

    const kpiConfiguration = this.kpiConfigurationFormService.getKpiConfiguration(this.editForm, this.moduleConfiguration);

    if (kpiConfiguration.id !== null) {
      this.subscribeToSaveResponse(this.kpiConfigurationService.update(kpiConfiguration));
    } else {
      this.subscribeToSaveResponse(this.kpiConfigurationService.create(kpiConfiguration));
    }
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

  selectModule(module: IModule): void {
    this.moduleConfiguration = new ModuleConfiguration(module as IModuleConfiguration);
    this.updateValidationForm(this.moduleConfiguration);
  }

  private updateValidationForm(moduleConfiguration: IModuleConfiguration): void {
    const setControlValidator = (controlName: string, isRequired: boolean | null | undefined): void => {
      const validators = isRequired ? [Validators.required] : null;
      this.editForm.get(controlName)?.setValidators(validators);
    };

    setControlValidator('excludePlannedShutdown', moduleConfiguration.configExcludePlannedShutdown);
    setControlValidator('excludeUnplannedShutdown', moduleConfiguration.configExcludeUnplannedShutdown);
    setControlValidator('tolerance', moduleConfiguration.configTolerance);
    setControlValidator('averageTimeLimit', moduleConfiguration.configAverageTimeLimit);
    setControlValidator('eligibilityThreshold', moduleConfiguration.configEligibilityThreshold);
    setControlValidator('evaluationType', moduleConfiguration.configEvaluationType);

    this.editForm.updateValueAndValidity();
  }
}
