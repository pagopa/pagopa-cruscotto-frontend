import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import _ from 'lodash';
import { IKpiConfiguration, NewKpiConfiguration } from '../kpi-configuration.model';
import { stringNumericValidatorFn } from 'app/shared/util/validator-util';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IKpiConfiguration for edit and NewKpiConfiguration for create.
 */
type KpiConfigurationFormGroupInput = IKpiConfiguration | PartialWithRequiredKeyOf<NewKpiConfiguration>;

type KpiConfigurationFormDefaults = Pick<NewKpiConfiguration, 'id'>;

type KpiConfigurationFormGroupContent = {
  id: FormControl<IKpiConfiguration['id'] | NewKpiConfiguration['id']>;
  moduleCode: FormControl<IKpiConfiguration['moduleCode'] | NewKpiConfiguration['moduleCode']>;
  excludePlannedShutdown: FormControl<IKpiConfiguration['excludePlannedShutdown'] | NewKpiConfiguration['excludePlannedShutdown']>;
  excludeUnplannedShutdown: FormControl<IKpiConfiguration['excludeUnplannedShutdown'] | NewKpiConfiguration['excludeUnplannedShutdown']>;
  eligibilityThreshold: FormControl<IKpiConfiguration['eligibilityThreshold'] | NewKpiConfiguration['eligibilityThreshold']>;
  tolerance: FormControl<IKpiConfiguration['tolerance'] | NewKpiConfiguration['tolerance']>;
  evaluationType: FormControl<IKpiConfiguration['evaluationType'] | NewKpiConfiguration['evaluationType']>;
  averageTimeLimit: FormControl<IKpiConfiguration['averageTimeLimit'] | NewKpiConfiguration['averageTimeLimit']>;
};

export type KpiConfigurationFormGroup = FormGroup<KpiConfigurationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class KpiConfigurationFormService {
  createKpiConfigurationFormGroup(kpiConfiguration: KpiConfigurationFormGroupInput = { id: null }): KpiConfigurationFormGroup {
    const kpiConfigurationRawValue = {
      ...this.getFormDefaults(),
      ...kpiConfiguration,
    };
    return new FormGroup<KpiConfigurationFormGroupContent>(
      {
        id: new FormControl(
          { value: kpiConfigurationRawValue.id, disabled: true },
          { validators: [Validators.required], nonNullable: true },
        ),
        moduleCode: new FormControl(kpiConfigurationRawValue.moduleCode, { validators: [Validators.required], nonNullable: true }),
        excludePlannedShutdown: new FormControl(kpiConfigurationRawValue.excludePlannedShutdown),
        excludeUnplannedShutdown: new FormControl(kpiConfigurationRawValue.excludeUnplannedShutdown),
        eligibilityThreshold: new FormControl(kpiConfigurationRawValue.eligibilityThreshold),
        tolerance: new FormControl(kpiConfigurationRawValue.tolerance),
        evaluationType: new FormControl(kpiConfigurationRawValue.evaluationType),
        averageTimeLimit: new FormControl(kpiConfigurationRawValue.averageTimeLimit),
      },
      {
        validators: [stringNumericValidatorFn('eligibilityThreshold', 'tolerance', 'averageTimeLimit')],
      },
    );
  }

  getKpiConfiguration(form: KpiConfigurationFormGroup): IKpiConfiguration | NewKpiConfiguration {
    const kpiConfiguration = form.getRawValue();
    return kpiConfiguration;
  }

  resetForm(form: KpiConfigurationFormGroup, kpiConfiguration: KpiConfigurationFormGroupInput): void {
    const kpiConfigurationRawValue = {
      ...this.getFormDefaults(),
      ...kpiConfiguration,
    };
    form.reset(
      {
        ...kpiConfigurationRawValue,
        id: { value: kpiConfigurationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): KpiConfigurationFormDefaults {
    return {
      id: null,
    };
  }
}
