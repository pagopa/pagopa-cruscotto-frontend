import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

export type RicercaMassivaCreateFormGroup = FormGroup<RicercaMassivaCreateFormContent>;

@Injectable({ providedIn: 'root' })
export class RicercaMassivaCreateFormService {
  createFormGroup(): RicercaMassivaCreateFormGroup {
    return new FormGroup<RicercaMassivaCreateFormContent>(
      {
        name: new FormControl(null, { validators: [Validators.required, Validators.maxLength(100)] }),
        periodStartDate: new FormControl(null, { validators: [Validators.required] }),
        periodEndDate: new FormControl(null, { validators: [Validators.required] }),
        paymentOutcome: new FormControl(null, { validators: [Validators.required] }),
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

    const periodStart = raw.periodStartDate?.startOf('day').toISOString();
    const periodEnd = raw.periodEndDate?.startOf('day').toISOString();
    if (periodStart) {
      perimeterFilter.periodStart = periodStart;
    }
    if (periodEnd) {
      perimeterFilter.periodEnd = periodEnd;
    }
    if (raw.paymentOutcome) {
      perimeterFilter.paymentOutcome = raw.paymentOutcome;
    }
    if (raw.touchpoint) {
      perimeterFilter.touchpoint = raw.touchpoint;
    }
    if (raw.paymentMethod) {
      perimeterFilter.paymentMethod = raw.paymentMethod;
    }
    if (raw.amountMin !== null) {
      perimeterFilter.amountMin = raw.amountMin;
    }
    if (raw.amountMax !== null) {
      perimeterFilter.amountMax = raw.amountMax;
    }
    if (raw.creditorInstitution?.id !== undefined) {
      perimeterFilter.creditorInstitutionId = raw.creditorInstitution.id;
    }
    if (raw.psp?.id !== undefined) {
      perimeterFilter.pspId = raw.psp.id;
    }
    if (raw.intermediary?.id !== undefined) {
      perimeterFilter.intermediaryId = raw.intermediary.id;
    }
    if (raw.intermediaryPsp?.id !== undefined) {
      perimeterFilter.intermediaryPspId = raw.intermediaryPsp.id;
    }
    if (raw.station?.id !== undefined) {
      perimeterFilter.stationId = raw.station.id;
    }
    if (raw.channel?.id !== undefined) {
      perimeterFilter.channelId = raw.channel.id;
    }

    return {
      name: raw.name ?? undefined,
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

    form.patchValue(
      {
        name: instance.name ?? null,
        periodStartDate: criteria.periodStart ? dayjs(criteria.periodStart) : null,
        periodEndDate: criteria.periodEnd ? dayjs(criteria.periodEnd) : null,
        paymentOutcome: criteria.paymentOutcome ?? null,
        touchpoint: criteria.touchpoint ?? null,
        paymentMethod: criteria.paymentMethod ?? null,
        amountMin: criteria.amountMin ?? null,
        amountMax: criteria.amountMax ?? null,
        creditorInstitution: lookups.creditorInstitutions.find(item => item.id === criteria.creditorInstitutionId) ?? null,
        psp: lookups.psp.find(item => item.id === criteria.pspId) ?? null,
        intermediary: lookups.intermediaries.find(item => item.id === criteria.intermediaryId) ?? null,
        intermediaryPsp: lookups.intermediariesPsp.find(item => item.id === criteria.intermediaryPspId) ?? null,
        station: lookups.stations.find(item => item.id === criteria.stationId) ?? null,
        channel: lookups.channels.find(item => item.id === criteria.channelId) ?? null,
      },
      { emitEvent: false },
    );
  }
}
