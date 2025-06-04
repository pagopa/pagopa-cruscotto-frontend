import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import _ from 'lodash';

import { stringNumericValidatorFn } from 'app/shared/util/validator-util';
import { IModule, NewModule, IModuleConfiguration } from '../module.model';

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
 * It accepts IModule for edit and NewModule for create.
 */
type ModuleFormGroupInput = IModule | PartialWithRequiredKeyOf<NewModule>;

type ModuleFormDefaults = Pick<NewModule, 'id'>;

type ModuleFormGroupContent = {
  id: FormControl<IModule['id'] | NewModule['id']>;
  code: FormControl<IModule['code'] | NewModule['code']>;
  name: FormControl<IModule['name'] | NewModule['name']>;
  description: FormControl<IModule['description'] | NewModule['description']>;
  analysisType: FormControl<IModule['analysisType'] | NewModule['analysisType']>;
  allowManualOutcome: FormControl<IModule['allowManualOutcome'] | NewModule['allowManualOutcome']>;
  status: FormControl<IModule['status'] | NewModule['status']>;
};

export type ModuleFormGroup = FormGroup<ModuleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ModuleFormService {
  createModuleFormGroup(Module: ModuleFormGroupInput = { id: null }): ModuleFormGroup {
    const ModuleRawValue = {
      ...this.getFormDefaults(),
      ...Module,
    };
    return new FormGroup<ModuleFormGroupContent>({
      id: new FormControl({ value: ModuleRawValue.id, disabled: false }, { nonNullable: false }),
      code: new FormControl({ value: ModuleRawValue.code, disabled: false }, { validators: [Validators.required], nonNullable: true }),
      name: new FormControl({ value: ModuleRawValue.name, disabled: false }, { validators: [Validators.required], nonNullable: true }),
      description: new FormControl(
        { value: ModuleRawValue.description, disabled: false },
        { validators: [Validators.required], nonNullable: true },
      ),
      analysisType: new FormControl(
        { value: ModuleRawValue.analysisType, disabled: false },
        { validators: [Validators.required], nonNullable: true },
      ),
      allowManualOutcome: new FormControl(
        { value: ModuleRawValue.allowManualOutcome, disabled: false },
        { validators: [Validators.required], nonNullable: true },
      ),
      status: new FormControl({ value: ModuleRawValue.status, disabled: false }, { validators: [Validators.required], nonNullable: true }),
    });
  }

  getModule(form: ModuleFormGroup): IModule | NewModule {
    return form.getRawValue();
  }

  resetForm(form: ModuleFormGroup, module: ModuleFormGroupInput): void {
    const ModuleRawValue = {
      ...this.getFormDefaults(),
      ...module,
    };
    form.reset(
      {
        ...ModuleRawValue,
        id: { value: ModuleRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ModuleFormDefaults {
    return {
      id: null,
    };
  }
}
