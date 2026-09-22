import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Dayjs } from 'dayjs/esm';

import dayjs from '../../../config/dayjs';
import { amountRangeValidatorFn, datepickerMaxRangeValidatorFn, datepickerRangeValidatorFn } from 'app/shared/util/validator-util';
import {
  AnagIntermediarioPa,
  AnagIntermediarioPsp,
  AnagCanale,
  AnagPaEmittente,
  AnagPsp,
  AnagStazione,
  PerimeterFilter,
  PaymentOutcome,
  SearchInstanceDTO,
} from '../../models/bulk-search.model';

export interface RicercaMassivaCreateFormLookups {
  creditorInstitutions: AnagPaEmittente[];
  psp: AnagPsp[];
  intermediaries: AnagIntermediarioPa[];
  intermediariesPsp: AnagIntermediarioPsp[];
  stations: AnagStazione[];
  channels: AnagCanale[];
}

type RicercaMassivaCreateFormContent = {
  name: FormControl<string | null>;
  periodStartDate: FormControl<Dayjs | null>;
  periodEndDate: FormControl<Dayjs | null>;
  periodStartTime: FormControl<string | null>;
  periodEndTime: FormControl<string | null>;
  paymentOutcome: FormControl<PaymentOutcome | null>;
  touchpoint: FormControl<string | null>;
  paymentMethod: FormControl<string | null>;
  amountMin: FormControl<number | null>;
  amountMax: FormControl<number | null>;
  creditorInstitution: FormControl<AnagPaEmittente | null>;
  psp: FormControl<AnagPsp | null>;
  intermediary: FormControl<AnagIntermediarioPa | null>;
  intermediaryPsp: FormControl<AnagIntermediarioPsp | null>;
  station: FormControl<AnagStazione | null>;
  channel: FormControl<AnagCanale | null>;
};

const massiveSearchPeriodValidatorFn: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const fromControl = control.get('periodStartDate');
  const toControl = control.get('periodEndDate');
  const fromTimeControl = control.get('periodStartTime');
  const toTimeControl = control.get('periodEndTime');

  const startDate = fromControl?.value as Dayjs | null;
  const endDate = toControl?.value as Dayjs | null;
  const startTime = fromTimeControl?.value as string | null;
  const endTime = toTimeControl?.value as string | null;

  if (!startDate || !endDate) {
    return null;
  }

  const startDateTime = startDate
    .clone()
    .hour(Number(startTime?.split(':')[0] ?? 0))
    .minute(Number(startTime?.split(':')[1] ?? 0));
  const endDateTime = endDate
    .clone()
    .hour(Number(endTime?.split(':')[0] ?? 0))
    .minute(Number(endTime?.split(':')[1] ?? 0));

  if (endDateTime.isBefore(startDateTime)) {
    fromControl?.setErrors({ ...(fromControl.errors ?? {}), matStartDateInvalid: true });
    return null;
  }

  const fromErrors = { ...(fromControl?.errors ?? {}) };
  delete fromErrors['matStartDateInvalid'];
  fromControl?.setErrors(Object.keys(fromErrors).length > 0 ? fromErrors : null);

  return null;
};

export type RicercaMassivaCreateFormGroup = FormGroup<RicercaMassivaCreateFormContent>;

@Injectable({ providedIn: 'root' })
export class RicercaMassivaCreateFormService {
  createFormGroup(): RicercaMassivaCreateFormGroup {
    return new FormGroup<RicercaMassivaCreateFormContent>(
      {
        name: new FormControl(null, { validators: [Validators.required, Validators.maxLength(100)] }),
        periodStartDate: new FormControl(null, { validators: [Validators.required] }),
        periodEndDate: new FormControl(null, { validators: [Validators.required] }),
        periodStartTime: new FormControl('00:00', { validators: [Validators.required] }),
        periodEndTime: new FormControl('23:59', { validators: [Validators.required] }),
        paymentOutcome: new FormControl(null),
        touchpoint: new FormControl(null),
        paymentMethod: new FormControl(null),
        amountMin: new FormControl(null, { validators: [Validators.min(0)] }),
        amountMax: new FormControl(null, { validators: [Validators.min(0)] }),
        creditorInstitution: new FormControl(null),
        psp: new FormControl(null),
        intermediary: new FormControl(null),
        intermediaryPsp: new FormControl(null),
        station: new FormControl(null),
        channel: new FormControl(null),
      },
      {
        validators: [
          datepickerRangeValidatorFn('periodStartDate', 'periodEndDate'),
          massiveSearchPeriodValidatorFn,
          datepickerMaxRangeValidatorFn('periodStartDate', 'periodEndDate', 14),
          amountRangeValidatorFn('amountMin', 'amountMax'),
        ],
      },
    );
  }

  // Invia le date a mezzanotte e solo i criteri effettivamente valorizzati.
  getSearchInstance(form: RicercaMassivaCreateFormGroup): SearchInstanceDTO {
    const raw = form.getRawValue();

    const perimeterFilter: PerimeterFilter = {};

    const periodStart = raw.periodStartDate
      ? raw.periodStartDate
          .clone()
          .hour(Number((raw.periodStartTime ?? '00:00').split(':')[0] ?? 0))
          .minute(Number((raw.periodStartTime ?? '00:00').split(':')[1] ?? 0))
          .second(0)
          .millisecond(0)
          .toISOString()
      : undefined;
    const periodEnd = raw.periodEndDate
      ? raw.periodEndDate
          .clone()
          .hour(Number((raw.periodEndTime ?? '23:59').split(':')[0] ?? 0))
          .minute(Number((raw.periodEndTime ?? '23:59').split(':')[1] ?? 0))
          .second(0)
          .millisecond(0)
          .toISOString()
      : undefined;
    if (periodStart || periodEnd) {
      perimeterFilter.paymentPeriod = { from: periodStart, to: periodEnd };
    }
    if (raw.paymentOutcome) {
      perimeterFilter.paymentStatuses = [raw.paymentOutcome];
    }
    if (raw.touchpoint) {
      perimeterFilter.touchpoints = [raw.touchpoint];
    }
    if (raw.paymentMethod) {
      perimeterFilter.paymentMethods = [raw.paymentMethod];
    }
    if (raw.amountMin !== null || raw.amountMax !== null) {
      perimeterFilter.amount = { from: raw.amountMin ?? undefined, to: raw.amountMax ?? undefined };
    }
    if (raw.creditorInstitution?.id !== undefined) {
      perimeterFilter.creditors = [raw.creditorInstitution.id];
    }
    if (raw.psp?.id !== undefined) {
      perimeterFilter.psps = [raw.psp.id];
    }
    if (raw.intermediary?.id !== undefined || raw.intermediaryPsp?.id !== undefined) {
      perimeterFilter.technologicalPartners = [raw.intermediary?.id, raw.intermediaryPsp?.id].filter(
        (id): id is number => id !== undefined,
      );
    }
    if (raw.station?.id !== undefined) {
      perimeterFilter.stations = [raw.station.id];
    }
    if (raw.channel?.id !== undefined) {
      perimeterFilter.channels = [raw.channel.id];
    }

    return {
      name: raw.name ?? undefined,
      inputType: 'FILTER',
      perimeterFilter,
    };
  }

  // Precompila il form con i dati di un'istanza esistente (usato dalla funzionalità "duplica").
  patchFromSearchInstance(
    form: RicercaMassivaCreateFormGroup,
    instance: SearchInstanceDTO,
    lookups: RicercaMassivaCreateFormLookups,
  ): void {
    const criteria = instance.perimeterFilter ?? {};

    const startDate = criteria.paymentPeriod?.from ? dayjs(criteria.paymentPeriod.from) : null;
    const endDate = criteria.paymentPeriod?.to ? dayjs(criteria.paymentPeriod.to) : null;

    form.patchValue(
      {
        name: instance.name ?? null,
        periodStartDate: startDate,
        periodEndDate: endDate,
        periodStartTime: startDate ? startDate.format('HH:mm') : '00:00',
        periodEndTime: endDate ? endDate.format('HH:mm') : '23:59',
        paymentOutcome: criteria.paymentStatuses?.[0] ?? null,
        touchpoint: criteria.touchpoints?.[0] ?? null,
        paymentMethod: criteria.paymentMethods?.[0] ?? null,
        amountMin: criteria.amount?.from ?? null,
        amountMax: criteria.amount?.to ?? null,
        creditorInstitution: lookups.creditorInstitutions.find(item => criteria.creditors?.includes(item.id ?? -1)) ?? null,
        psp: lookups.psp.find(item => criteria.psps?.includes(item.id ?? -1)) ?? null,
        intermediary: lookups.intermediaries.find(item => criteria.technologicalPartners?.includes(item.id ?? -1)) ?? null,
        intermediaryPsp: lookups.intermediariesPsp.find(item => criteria.technologicalPartners?.includes(item.id ?? -1)) ?? null,
        station: lookups.stations.find(item => criteria.stations?.includes(item.id ?? -1)) ?? null,
        channel: lookups.channels.find(item => criteria.channels?.includes(item.id ?? -1)) ?? null,
      },
      { emitEvent: false },
    );
  }
}
