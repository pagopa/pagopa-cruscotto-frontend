import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { datepickerMaxRangeValidatorFn, datepickerRangeValidatorFn } from 'app/shared/util/validator-util';
import {
  PerimeterFilter,
  PaymentOutcome,
  SearchInstanceDTO,
  LookupOption,
  SearchInstancePOSTDTO,
  PerimeterFilterPOSTDTO,
} from '../../models/bulk-search.model';
import { Dayjs } from 'dayjs/esm';
import dayjs from '../../../config/dayjs';

export interface RicercaMassivaCreateFormLookups {
  creditorInstitutions: LookupOption[];
  psp: LookupOption[];
  intermediaries: LookupOption[];
  intermediariesPsp: LookupOption[];
  stations: LookupOption[];
  channels: LookupOption[];
}

type RicercaMassivaCreateFormContent = {
  name: FormControl<string | null>;
  periodStartDate: FormControl<Dayjs | null>;
  periodEndDate: FormControl<Dayjs | null>;
  periodStartTime: FormControl<Dayjs | null>;
  periodEndTime: FormControl<Dayjs | null>;
  paymentOutcome: FormControl<PaymentOutcome | null>;
  touchpoint: FormControl<LookupOption | null>;
  paymentMethod: FormControl<LookupOption | null>;
  amount: FormControl<string | null>;
  creditorInstitution: FormControl<LookupOption | null>;
  psp: FormControl<LookupOption | null>;
  intermediary: FormControl<LookupOption | null>;
  intermediaryPsp: FormControl<LookupOption | null>;
  station: FormControl<LookupOption | null>;
  channel: FormControl<LookupOption | null>;
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
export function amountRangeValidatorFn(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.trim();

    if (!value) {
      return null;
    }

    const regex = /^\d+(\.\d+)?(-\d+(\.\d+)?)?$/;

    if (!regex.test(value)) {
      return { amountFormat: true };
    }

    const parts = value.split('-');

    if (parts.length === 2) {
      const min = Number(parts[0]);
      const max = Number(parts[1]);

      if (max < min) {
        return { amountRangeOrder: true };
      }
    }

    return null;
  };
}

export type RicercaMassivaCreateFormGroup = FormGroup<RicercaMassivaCreateFormContent>;

@Injectable({ providedIn: 'root' })
export class RicercaMassivaCreateFormService {
  createFormGroup(csv?: boolean): RicercaMassivaCreateFormGroup {
    return new FormGroup<RicercaMassivaCreateFormContent>(
      {
        name: new FormControl(null, { validators: [Validators.required, Validators.maxLength(100)] }),
        periodStartDate: new FormControl(null, csv ? null : { validators: [Validators.required] }),
        periodEndDate: new FormControl(null, csv ? null : { validators: [Validators.required] }),
        periodStartTime: new FormControl<Dayjs | null>(null),
        periodEndTime: new FormControl<Dayjs | null>(null),
        paymentOutcome: new FormControl(null),
        touchpoint: new FormControl(null),
        paymentMethod: new FormControl(null),
        amount: new FormControl(null, { validators: [Validators.min(0), amountRangeValidatorFn] }),
        creditorInstitution: new FormControl(null),
        psp: new FormControl(null),
        intermediary: new FormControl(null),
        intermediaryPsp: new FormControl(null),
        station: new FormControl(null),
        channel: new FormControl(null),
        selectedReports: new FormControl(['POSITION', 'TOKEN', 'TRANSFER']),
      },
      {
        validators: csv
          ? []
          : [
              datepickerRangeValidatorFn('periodStartDate', 'periodEndDate'),
              massiveSearchPeriodValidatorFn,
              datepickerMaxRangeValidatorFn('periodStartDate', 'periodEndDate', 14),
            ],
      },
    );
  }

  // Invia le date a mezzanotte e solo i criteri effettivamente valorizzati.
  getSearchInstance(form: RicercaMassivaCreateFormGroup): SearchInstancePOSTDTO {
    const raw = form.getRawValue();

    const perimeterFilter: PerimeterFilterPOSTDTO = {};

    const periodStart = raw.periodStartDate
      ? raw.periodStartDate
          .clone()
          .hour(raw.periodStartTime ? raw.periodStartTime.hour() : 0)
          .minute(raw.periodStartTime ? raw.periodStartTime.minute() : 0)
          .second(0)
          .millisecond(0)
          .format('YYYY-MM-DDTHH:mm:ss')
      : undefined;
    const periodEnd = raw.periodEndDate
      ? raw.periodEndDate
          .clone()
          .hour(raw.periodEndTime ? raw.periodEndTime.hour() : 0)
          .minute(raw.periodEndTime ? raw.periodEndTime.minute() : 0)
          .second(0)
          .millisecond(0)
          .add(raw.periodEndTime ? 0 : 1, 'day')
          .format('YYYY-MM-DDTHH:mm:ss')
      : undefined;
    if (periodStart || periodEnd) {
      perimeterFilter.paymentPeriod = { from: periodStart, to: periodEnd };
    }
    if (raw.paymentOutcome) {
      perimeterFilter.paymentStatuses = [raw.paymentOutcome];
    }
    if (raw.touchpoint?.id !== undefined) {
      perimeterFilter.touchpoints = [raw.touchpoint.id];
    }
    if (raw.paymentMethod?.id !== undefined) {
      perimeterFilter.paymentMethods = [raw.paymentMethod.id];
    }
    if (raw.amount) {
      if (raw.amount.toString().includes('-')) {
        const [min, max] = raw.amount.split('-');
        perimeterFilter.amount = {
          min: Number(min) || undefined,
          max: Number(max) || undefined,
        };
      } else {
        perimeterFilter.amount = { exact: Number(raw.amount) || undefined };
      }
    }
    if (raw.creditorInstitution?.id !== undefined) {
      perimeterFilter.creditors = [raw.creditorInstitution.id];
    }
    if (raw.psp?.id !== undefined) {
      perimeterFilter.psps = [raw.psp.id];
    }
    if (raw.intermediary?.id !== undefined) {
      perimeterFilter.technologicalPartnersPa = [raw.intermediary?.id];
    }
    if (raw.intermediaryPsp?.id !== undefined) {
      perimeterFilter.technologicalPartnersPsp = [raw.intermediaryPsp?.id];
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
    const amount = String(criteria.amount?.exact) ?? (criteria.amount?.min ? criteria.amount?.min + '-' + criteria.amount.max : null);

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
        amount: amount,
        creditorInstitution: criteria.creditors?.[0] ?? null,
        psp: criteria.psps?.[0] ?? null,
        intermediary: criteria.technologicalPartnersPa?.[0] ?? null,
        intermediaryPsp: criteria.technologicalPartnersPsp?.[0] ?? null,
        station: criteria.stations?.[0] ?? null,
        channel: criteria.channels?.[0] ?? null,
        selectedReports: instance.selectedReports?.split(',') ?? ['POSITION', 'TOKEN', 'TRANSFER'],
      },
      { emitEvent: false },
    );
  }
}
