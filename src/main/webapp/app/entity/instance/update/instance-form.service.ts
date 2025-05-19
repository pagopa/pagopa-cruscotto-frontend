import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IInstance, NewInstance } from '../models/instance.model';
import { IPartner } from '../../partner/partner.model';
import _ from 'lodash';
import { datepickerRangeValidatorFn } from 'app/shared/util/validator-util';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInstance for edit and NewInstance for create.
 */
type InstanceFormGroupInput = IInstance | PartialWithRequiredKeyOf<NewInstance>;

type InstanceFormDefaults = Pick<NewInstance, 'id'>;

type InstanceFormGroupContent = {
  id: FormControl<IInstance['id'] | NewInstance['id']>;
  partner: FormControl<IPartner | null>;
  predictedDateAnalysis: FormControl<IInstance['predictedDateAnalysis']>;
  analysisPeriodStartDate: FormControl<IInstance['analysisPeriodStartDate']>;
  analysisPeriodEndDate: FormControl<IInstance['analysisPeriodEndDate']>;
};

export type InstanceFormGroup = FormGroup<InstanceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InstanceFormService {
  createInstanceFormGroup(instance: InstanceFormGroupInput = { id: null }): InstanceFormGroup {
    const instanceRawValue = {
      ...this.getFormDefaults(),
      ...instance,
    };
    return new FormGroup<InstanceFormGroupContent>(
      {
        id: new FormControl({ value: instanceRawValue.id, disabled: true }, { validators: [Validators.required], nonNullable: true }),
        partner: new FormControl(instanceRawValue.partnerId ? <IPartner>{ id: instanceRawValue.partnerId } : null, {
          validators: [Validators.required],
          nonNullable: true,
        }),
        predictedDateAnalysis: new FormControl(instanceRawValue.predictedDateAnalysis, {
          validators: [Validators.required],
          nonNullable: true,
        }),
        analysisPeriodStartDate: new FormControl(instanceRawValue.analysisPeriodStartDate, {
          validators: [Validators.required],
          nonNullable: true,
        }),
        analysisPeriodEndDate: new FormControl(instanceRawValue.analysisPeriodEndDate, {
          validators: [Validators.required],
          nonNullable: true,
        }),
      },
      {
        validators: [datepickerRangeValidatorFn('analysisPeriodStartDate', 'analysisPeriodEndDate')],
      },
    );
  }

  getInstance(form: InstanceFormGroup): IInstance | NewInstance {
    const instance = form.getRawValue();

    return { ..._.omit(instance, 'partner'), partnerId: instance.partner?.id } as IInstance | NewInstance;
  }

  resetForm(form: InstanceFormGroup, instance: InstanceFormGroupInput): void {
    const instanceRawValue = {
      ...this.getFormDefaults(),
      ...instance,
      partner: instance.partnerId !== null ? { id: instance.partnerId } : null,
    };
    form.reset(
      {
        ...instanceRawValue,
        id: { value: instanceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InstanceFormDefaults {
    return {
      id: null,
    };
  }
}
