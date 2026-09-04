import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Dayjs } from 'dayjs/esm';

import dayjs from '../../../config/dayjs';
import { amountRangeValidatorFn, datepickerRangeValidatorFn } from 'app/shared/util/validator-util';
import {
  AnagIntermediarioPa,
  AnagPaEmittente,
  AnagPsp,
  AnagStazione,
  BulkSearchCriteria,
  PaymentOutcome,
  SearchInstanceDTO,
} from '../../models/bulk-search.model';

export interface RicercaMassivaCreateFormLookups {
  creditorInstitutions: AnagPaEmittente[];
  psp: AnagPsp[];
  intermediaries: AnagIntermediarioPa[];
  stations: AnagStazione[];
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
  station: FormControl<AnagStazione | null>;
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
        station: new FormControl(null),
      },
      {
        validators: [datepickerRangeValidatorFn('periodStartDate', 'periodEndDate'), amountRangeValidatorFn('amountMin', 'amountMax')],
      },
    );
  }

  // Invia le date a mezzanotte e solo i criteri effettivamente valorizzati.
  getSearchInstance(form: RicercaMassivaCreateFormGroup): SearchInstanceDTO {
    const raw = form.getRawValue();

    const searchCriteria: BulkSearchCriteria = {};

    const periodStart = raw.periodStartDate?.startOf('day').toISOString();
    const periodEnd = raw.periodEndDate?.startOf('day').toISOString();
    if (periodStart) {
      searchCriteria.periodStart = periodStart;
    }
    if (periodEnd) {
      searchCriteria.periodEnd = periodEnd;
    }
    if (raw.paymentOutcome) {
      searchCriteria.paymentOutcome = raw.paymentOutcome;
    }
    if (raw.touchpoint) {
      searchCriteria.touchpoint = raw.touchpoint;
    }
    if (raw.paymentMethod) {
      searchCriteria.paymentMethod = raw.paymentMethod;
    }
    if (raw.amountMin !== null) {
      searchCriteria.amountMin = raw.amountMin;
    }
    if (raw.amountMax !== null) {
      searchCriteria.amountMax = raw.amountMax;
    }
    if (raw.creditorInstitution?.id !== undefined) {
      searchCriteria.creditorInstitutionId = raw.creditorInstitution.id;
    }
    if (raw.psp?.id !== undefined) {
      searchCriteria.pspId = raw.psp.id;
    }
    if (raw.intermediary?.id !== undefined) {
      searchCriteria.intermediaryId = raw.intermediary.id;
    }
    if (raw.station?.id !== undefined) {
      searchCriteria.stationId = raw.station.id;
    }

    return {
      name: raw.name ?? undefined,
      searchCriteria,
    };
  }

  // Precompila il form con i dati di un'istanza esistente (usato dalla funzionalità "duplica").
  patchFromSearchInstance(
    form: RicercaMassivaCreateFormGroup,
    instance: SearchInstanceDTO,
    lookups: RicercaMassivaCreateFormLookups,
  ): void {
    const criteria = instance.searchCriteria ?? {};

    form.patchValue({
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
      station: lookups.stations.find(item => item.id === criteria.stationId) ?? null,
    });
  }
}
