import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPartner } from '../../partner/partner.model';
import _ from 'lodash';
import dayjs from 'dayjs/esm';
import { datepickerRangeValidatorFn } from 'app/shared/util/validator-util';
import { IShutdown, NewShutdown } from '../shutdown.model';
import { IStation } from 'app/entity/station/station.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IShutdown for edit and NewShutdown for create.
 */
type ShutdownFormGroupInput = IShutdown | PartialWithRequiredKeyOf<NewShutdown>;

type ShutdownFormDefaults = Pick<NewShutdown, 'id'>;

type ShutdownFormGroupContent = {
  id: FormControl<IShutdown['id'] | NewShutdown['id']>;
  partner: FormControl<IPartner | null>;
  station: FormControl<IStation | null>;
  shutdownStartDate: FormControl<IShutdown['shutdownStartDate']>;
  shutdownEndDate: FormControl<IShutdown['shutdownEndDate']>;
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
        }),
        station: new FormControl(shutdownRawValue.stationId ? <IStation>{ id: Number(shutdownRawValue.stationId) } : null, {
          validators: [Validators.required],
          nonNullable: true,
        }),
        shutdownStartDate: new FormControl(shutdownRawValue.shutdownStartDate, {
          validators: [Validators.required],
          nonNullable: true,
        }),
        shutdownEndDate: new FormControl(shutdownRawValue.shutdownEndDate, {
          validators: [Validators.required],
          nonNullable: true,
        }),
      },
      {
        validators: [datepickerRangeValidatorFn('shutdownStartDate', 'shutdownEndDate')],
      },
    );
  }

  getShutdown(form: ShutdownFormGroup): IShutdown | NewShutdown {
    const shutdown = form.getRawValue();

    return {
      ..._.omit(shutdown, 'partner', 'station', 'station'),
      partnerId: shutdown.partner?.id,
      stationId: String(shutdown.station?.id),
    } as IShutdown | NewShutdown;
  }

  resetForm(form: ShutdownFormGroup, shutdown: ShutdownFormGroupInput): void {
    const shutdownRawValue = {
      ...this.getFormDefaults(),
      ...shutdown,
      partner: shutdown.partnerId !== null ? { id: shutdown.partnerId } : null,
      station: shutdown.stationId !== null ? { id: shutdown.stationId } : null,
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
