import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPartner } from '../../partner/partner.model';
import _ from 'lodash';
import dayjs from 'dayjs/esm';
import { datepickerRangeValidatorFn } from 'app/shared/util/validator-util';
import { IShutdown, NewShutdown } from '../shutdown.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInstance for edit and NewInstance for create.
 */
type ShutdownFormGroupInput = IShutdown | PartialWithRequiredKeyOf<NewShutdown>;

type ShutdownFormDefaults = Pick<NewShutdown, 'id'>;

type ShutdownFormGroupContent = {
  id: FormControl<IShutdown['id'] | NewShutdown['id']>;
  partner: FormControl<IPartner | null>;
  /*
  predictedDateAnalysis: FormControl<IShutdown['predictedDateAnalysis']>;
  analysisPeriodStartDate: FormControl<IShutdown['analysisPeriodStartDate']>;
  analysisPeriodEndDate: FormControl<IShutdown['analysisPeriodEndDate']>;
  */
};

export type ShutdownFormGroup = FormGroup<ShutdownFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ShutdownFormService {
  createShutdownFormGroup(shutdown: ShutdownFormGroupInput = { id: null }): ShutdownFormGroup {
    const shutdownRawValue = {
      ...this.getFormDefaults(),
      ...shutdown,
    };
    return new FormGroup<ShutdownFormGroupContent>(
      {
        id: new FormControl({ value: shutdownRawValue.id, disabled: true }, { validators: [Validators.required], nonNullable: true }),
        partner: new FormControl(shutdownRawValue.partnerId ? <IPartner>{ id: shutdownRawValue.partnerId } : null, {
          validators: [Validators.required],
          nonNullable: true,
        }) /*
        predictedDateAnalysis: new FormControl(shutdownRawValue.predictedDateAnalysis, {
          validators: [Validators.required],
          nonNullable: true,
        }),
        analysisPeriodStartDate: new FormControl(shutdownRawValue.analysisPeriodStartDate, {
          validators: [Validators.required],
          nonNullable: true,
        }),
        analysisPeriodEndDate: new FormControl(shutdownRawValue.analysisPeriodEndDate, {
          validators: [Validators.required],
          nonNullable: true,
        }),*/,
      },
      {
        validators: [datepickerRangeValidatorFn('analysisPeriodStartDate', 'analysisPeriodEndDate')],
      },
    );
  }

  getShutdown(form: ShutdownFormGroup): IShutdown | NewShutdown {
    const shutdown = form.getRawValue();

    return { ..._.omit(shutdown, 'partner'), partnerId: shutdown.partner?.id } as IShutdown | NewShutdown;
  }

  resetForm(form: ShutdownFormGroup, shutdown: ShutdownFormGroupInput): void {
    const shutdownRawValue = {
      ...this.getFormDefaults(),
      ...shutdown,
      partner: shutdown.partnerId !== null ? { id: shutdown.partnerId } : null,
    };
    form.reset(
      {
        ...shutdownRawValue,
        id: { value: shutdownRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ShutdownFormDefaults {
    return {
      id: null,
    };
  }
}
