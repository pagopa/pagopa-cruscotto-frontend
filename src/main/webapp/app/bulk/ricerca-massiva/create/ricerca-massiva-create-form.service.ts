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
  periodStartTime: FormControl<Dayjs | null>;
  periodEndTime: FormControl<Dayjs | null>;
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
  selectedReports: FormControl<string[] | null>;
};

const getTime = (value: Dayjs | null | undefined): { hour: number; minute: number } => {
  if (!value) {
    return { hour: 0, minute: 0 };
  }

  return { hour: value.hour(), minute: value.minute() };
};

const clearTimeError = (control: AbstractControl | null, errorKey: string): void => {
  if (!control) {
    return;
  }

  const currentErrors = { ...(control.errors ?? {}) };
  delete currentErrors[errorKey];
  control.setErrors(Object.keys(currentErrors).length > 0 ? currentErrors : null);
};

const massiveSearchPeriodValidatorFn: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const fromControl = control.get('periodStartDate');
  const toControl = control.get('periodEndDate');
  const fromTimeControl = control.get('periodStartTime');
  const toTimeControl = control.get('periodEndTime');

  const startDate = fromControl?.value as Dayjs | null;
  const endDate = toControl?.value as Dayjs | null;
  const startTime = fromTimeControl?.value as Dayjs | null;
  const endTime = toTimeControl?.value as Dayjs | null;

  if (!startDate || !endDate) {
    clearTimeError(fromTimeControl, 'timeSequenceInvalid');
    clearTimeError(toTimeControl, 'timeSequenceInvalid');
    return null;
  }

  const startDateTime = startTime
    ? startDate.clone().hour(getTime(startTime).hour).minute(getTime(startTime).minute).second(0).millisecond(0)
    : startDate.clone().startOf('day');
  const endDateTime = endTime
    ? endDate.clone().hour(getTime(endTime).hour).minute(getTime(endTime).minute).second(0).millisecond(0)
    : endDate.clone().add(1, 'day').startOf('day');

  if (startDate.isSame(endDate, 'day') && startTime && endTime && endDateTime.isSameOrBefore(startDateTime)) {
    fromTimeControl?.setErrors({ ...(fromTimeControl.errors ?? {}), timeSequenceInvalid: true });
    toTimeControl?.setErrors({ ...(toTimeControl.errors ?? {}), timeSequenceInvalid: true });
    return { timeSequenceInvalid: true };
  }

  clearTimeError(fromTimeControl, 'timeSequenceInvalid');
  clearTimeError(toTimeControl, 'timeSequenceInvalid');

  if (endDateTime.isBefore(startDateTime)) {
    fromControl?.setErrors({ ...(fromControl.errors ?? {}), matStartDateInvalid: true });
    toControl?.setErrors({ ...(toControl.errors ?? {}), matEndDateInvalid: true });
    return null;
  }

  const fromErrors = { ...(fromControl?.errors ?? {}) };
  delete fromErrors['matStartDateInvalid'];
  fromControl?.setErrors(Object.keys(fromErrors).length > 0 ? fromErrors : null);

  const toErrors = { ...(toControl?.errors ?? {}) };
  delete toErrors['matEndDateInvalid'];
  toControl?.setErrors(Object.keys(toErrors).length > 0 ? toErrors : null);

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
        periodStartTime: new FormControl<Dayjs | null>(null),
        periodEndTime: new FormControl<Dayjs | null>(null),
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
        selectedReports: new FormControl(null),
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
          .hour(raw.periodStartTime ? raw.periodStartTime.hour() : 0)
          .minute(raw.periodStartTime ? raw.periodStartTime.minute() : 0)
          .second(0)
          .millisecond(0)
          .toISOString()
      : undefined;
    const periodEnd = raw.periodEndDate
      ? raw.periodEndDate
          .clone()
          .hour(raw.periodEndTime ? raw.periodEndTime.hour() : 0)
          .minute(raw.periodEndTime ? raw.periodEndTime.minute() : 0)
          .second(0)
          .millisecond(0)
          .add(raw.periodEndTime ? 0 : 1, 'day')
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
    const selectedReports = raw.selectedReports ? raw.selectedReports.join(',') : undefined;
    return {
      name: raw.name ?? undefined,
      inputType: 'FILTER',
      selectedReports,
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
        periodStartTime: startDate ? startDate.clone() : null,
        periodEndTime: endDate ? endDate.clone() : null,
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
        selectedReports: instance.selectedReports?.split(',') ?? null,
      },
      { emitEvent: false },
    );
  }
}
