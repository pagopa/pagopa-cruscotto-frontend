import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IModule, NewModule } from '../module.model';
import { AnalysisType } from '../../instance-module/models/analysis-type.model';

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
  analysisType: FormControl<IModule['analysisType'] | NewModule['analysisType'] | ''>;
  allowManualOutcome: FormControl<IModule['allowManualOutcome'] | NewModule['allowManualOutcome'] | ''>;
  status: FormControl<IModule['status'] | NewModule['status'] | ''>;
  configAverageTimeLimit: FormControl<IModule['configAverageTimeLimit'] | NewModule['configAverageTimeLimit'] | ''>;
  configEligibilityThreshold: FormControl<IModule['configEligibilityThreshold'] | NewModule['configEligibilityThreshold'] | ''>;
  configEvaluationType: FormControl<IModule['configEvaluationType'] | NewModule['configEvaluationType'] | ''>;
  configExcludePlannedShutdown: FormControl<IModule['configExcludePlannedShutdown'] | NewModule['configExcludePlannedShutdown'] | ''>;
  configExcludeUnplannedShutdown: FormControl<IModule['configExcludeUnplannedShutdown'] | NewModule['configExcludeUnplannedShutdown'] | ''>;
  configTolerance: FormControl<IModule['configAverageTimeLimit'] | NewModule['configAverageTimeLimit'] | ''>;
};

export type ModuleFormGroup = FormGroup<ModuleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ModuleFormService {
  createModuleFormGroup(module: ModuleFormGroupInput = { id: null }): ModuleFormGroup {
    const moduleRawValue = {
      ...this.getFormDefaults(),
      ...module,
    };
    return new FormGroup<ModuleFormGroupContent>({
      id: new FormControl({ value: moduleRawValue.id, disabled: false }, { nonNullable: false }),
      code: new FormControl({ value: moduleRawValue.code, disabled: false }, { validators: [Validators.required], nonNullable: true }),
      name: new FormControl({ value: moduleRawValue.name, disabled: false }, { validators: [Validators.required], nonNullable: true }),
      description: new FormControl(
        { value: moduleRawValue.description, disabled: false },
        { validators: [Validators.required], nonNullable: true },
      ),
      analysisType: new FormControl(
        { value: moduleRawValue.analysisType, disabled: false },
        { validators: [Validators.required], nonNullable: true },
      ),
      allowManualOutcome: new FormControl(
        { value: moduleRawValue.allowManualOutcome, disabled: false },
        { validators: [Validators.required], nonNullable: true },
      ),
      status: new FormControl({ value: moduleRawValue.status, disabled: false }, { validators: [Validators.required], nonNullable: true }),
      configAverageTimeLimit: new FormControl(
        { value: moduleRawValue.configAverageTimeLimit, disabled: false },
        { validators: [Validators.required], nonNullable: true },
      ),
      configEligibilityThreshold: new FormControl(
        { value: moduleRawValue.configEligibilityThreshold, disabled: false },
        { validators: [Validators.required], nonNullable: true },
      ),
      configEvaluationType: new FormControl(
        { value: moduleRawValue.configEvaluationType, disabled: false },
        { validators: [Validators.required], nonNullable: true },
      ),
      configExcludePlannedShutdown: new FormControl(
        { value: moduleRawValue.configExcludePlannedShutdown, disabled: false },
        { validators: [Validators.required], nonNullable: true },
      ),
      configExcludeUnplannedShutdown: new FormControl(
        { value: moduleRawValue.configExcludeUnplannedShutdown, disabled: false },
        { validators: [Validators.required], nonNullable: true },
      ),
      configTolerance: new FormControl(
        { value: moduleRawValue.configTolerance, disabled: false },
        { validators: [Validators.required], nonNullable: true },
      ),
    });
  }

  getModule(form: ModuleFormGroup): IModule | NewModule {
    const rawValue = form.getRawValue();
    return {
      ...rawValue,
      analysisType: String(rawValue.analysisType),
      allowManualOutcome: !!rawValue.allowManualOutcome,
      configAverageTimeLimit: !!rawValue.configAverageTimeLimit,
      configEligibilityThreshold: !!rawValue.configEligibilityThreshold,
      configEvaluationType: !!rawValue.configEvaluationType,
      configExcludePlannedShutdown: !!rawValue.configExcludePlannedShutdown,
      configExcludeUnplannedShutdown: !!rawValue.configExcludeUnplannedShutdown,
      configTolerance: !!rawValue.configTolerance,
      status: String(rawValue.status),
    };
  }

  resetForm(form: ModuleFormGroup, module: ModuleFormGroupInput): void {
    const moduleRawValue = {
      ...this.getFormDefaults(),
      ...module,
    };
    form.reset(
      {
        ...moduleRawValue,
        id: { value: moduleRawValue.id, disabled: true },
        code: { value: moduleRawValue.code, disabled: true },
        analysisType: { value: moduleRawValue.analysisType, disabled: false },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  prepareEmptyForm(form: ModuleFormGroup): void {
    const moduleRawValue = {
      ...this.getFormDefaults(),
    };
    form.reset(
      {
        ...moduleRawValue,
        analysisType: { value: AnalysisType.MANUALE, disabled: false },
        allowManualOutcome: { value: '', disabled: false },
        status: { value: '', disabled: false },
        configAverageTimeLimit: { value: '', disabled: false },
        configEligibilityThreshold: { value: '', disabled: false },
        configEvaluationType: { value: '', disabled: false },
        configExcludePlannedShutdown: { value: '', disabled: false },
        configExcludeUnplannedShutdown: { value: '', disabled: false },
        configTolerance: { value: '', disabled: false },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ModuleFormDefaults {
    return {
      id: null,
    };
  }
}
