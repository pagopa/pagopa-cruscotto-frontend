import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import _ from 'lodash';
import { IKpiConfiguration, NewKpiConfiguration } from '../kpi-configuration.model';
import { stringNumericValidatorFn } from 'app/shared/util/validator-util';
import { IModule, IModuleConfiguration } from '../../../module/module.model';

const CONFIG_FIELD_MAPPINGS = {
  configEligibilityThreshold: 'eligibilityThreshold',
  configTolerance: 'tolerance',
  configAverageTimeLimit: 'averageTimeLimit',
  configEvaluationType: 'evaluationType',
  configExcludePlannedShutdown: 'excludePlannedShutdown',
  configExcludeUnplannedShutdown: 'excludeUnplannedShutdown',
} as const;

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
  module: FormControl<IModule | null>;
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
        module: new FormControl(
          {
            value: kpiConfigurationRawValue.moduleId
              ? <IModule>{
                  id: kpiConfigurationRawValue.moduleId,
                  name: kpiConfigurationRawValue.moduleName,
                  code: kpiConfigurationRawValue.moduleCode,
                }
              : null,
            disabled: kpiConfigurationRawValue.id !== null,
          },
          {
            validators: [Validators.required],
            nonNullable: true,
          },
        ),
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

  getKpiConfiguration(form: KpiConfigurationFormGroup, moduleConfiguration: IModuleConfiguration): IKpiConfiguration | NewKpiConfiguration {
    const kpiConfiguration = form.getRawValue();

    const toOmit = this.getFieldsToOmit(moduleConfiguration);
    toOmit.push('partner');

    return {
      ..._.omit(kpiConfiguration, toOmit),
      moduleCode: kpiConfiguration.module?.code,
    } as IKpiConfiguration | NewKpiConfiguration;
  }

  resetForm(form: KpiConfigurationFormGroup, kpiConfiguration: KpiConfigurationFormGroupInput): void {
    console.log('resetForm', kpiConfiguration.eligibilityThreshold ? kpiConfiguration.eligibilityThreshold.toFixed(2) : null);
    const kpiConfigurationRawValue = {
      ...this.getFormDefaults(),
      ...kpiConfiguration,
      module:
        kpiConfiguration.moduleId !== null
          ? { id: kpiConfiguration.moduleId, name: kpiConfiguration.moduleName, code: kpiConfiguration.moduleCode }
          : null,
      eligibilityThreshold: kpiConfiguration.eligibilityThreshold ? kpiConfiguration.eligibilityThreshold.toFixed(2) : null,
      tolerance: kpiConfiguration.tolerance ? kpiConfiguration.tolerance.toFixed(2) : null,
      averageTimeLimit: kpiConfiguration.averageTimeLimit ? kpiConfiguration.averageTimeLimit.toFixed(2) : null,
    };
    form.reset(
      {
        ...kpiConfigurationRawValue,
        id: { value: kpiConfigurationRawValue.id, disabled: true },
        module: {
          value: kpiConfigurationRawValue.moduleId
            ? <IModule>{
                id: kpiConfigurationRawValue.moduleId,
                name: kpiConfigurationRawValue.moduleName,
                code: kpiConfigurationRawValue.moduleCode,
              }
            : null,
          disabled: kpiConfigurationRawValue.id !== null,
        },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): KpiConfigurationFormDefaults {
    return {
      id: null,
    };
  }

  private getFieldsToOmit(moduleConfiguration: IModuleConfiguration): string[] {
    return Object.entries(CONFIG_FIELD_MAPPINGS)
      .filter(([configKey]) => !moduleConfiguration[configKey as keyof IModuleConfiguration])
      .map(([, fieldName]) => fieldName);
  }
}
