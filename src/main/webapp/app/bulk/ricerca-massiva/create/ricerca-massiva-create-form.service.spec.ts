import { TestBed } from '@angular/core/testing';

import dayjs from '../../../config/dayjs';
import { RicercaMassivaCreateFormService } from './ricerca-massiva-create-form.service';

describe('RicercaMassivaCreateFormService', () => {
  let service: RicercaMassivaCreateFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RicercaMassivaCreateFormService);
  });

  it('creates an invalid form group when required fields are empty', () => {
    const form = service.createFormGroup();

    expect(form.valid).toBe(false);
    expect(form.controls.periodStartDate.hasError('required')).toBe(true);
    expect(form.controls.paymentOutcome.hasError('required')).toBe(true);
  });

  it('is valid once all required fields are filled', () => {
    const form = service.createFormGroup();
    form.patchValue({
      name: 'Estrazione test',
      periodStartDate: dayjs('2026-01-01'),
      periodEndDate: dayjs('2026-01-02'),
      paymentOutcome: 'OK',
    });

    expect(form.valid).toBe(true);
  });

  it('flags the end date/time when it precedes the start date/time', () => {
    const form = service.createFormGroup();
    form.patchValue({
      name: 'Estrazione test',
      periodStartDate: dayjs('2026-01-10'),
      periodEndDate: dayjs('2026-01-09'),
      paymentOutcome: 'OK',
    });

    expect(form.controls.periodStartDate.hasError('matStartDateInvalid')).toBe(true);
    expect(form.valid).toBe(false);
  });

  it('flags the max amount when lower than the min amount', () => {
    const form = service.createFormGroup();
    form.patchValue({ amountMin: 100, amountMax: 10 });

    expect(form.controls.amountMax.hasError('amountRangeInvalid')).toBe(true);
  });

  it('does not flag the amount range when only one bound is set', () => {
    const form = service.createFormGroup();
    form.patchValue({ amountMin: 100 });

    expect(form.controls.amountMax.hasError('amountRangeInvalid')).toBe(false);
  });

  it('builds a payload containing only the filled search criteria', () => {
    const form = service.createFormGroup();
    form.patchValue({
      name: 'Estrazione test',
      periodStartDate: dayjs('2026-01-01'),
      periodEndDate: dayjs('2026-01-02'),
      paymentOutcome: 'OK',
      psp: { id: 5, codice: 'PSP1', description: 'Psp uno' },
    });

    const payload = service.getSearchInstance(form);

    expect(payload.name).toBe('Estrazione test');
    expect(payload.searchCriteria?.paymentOutcome).toBe('OK');
    expect(payload.searchCriteria?.pspId).toBe(5);
    expect(payload.searchCriteria?.periodStart).toBe(dayjs('2026-01-01').startOf('day').toISOString());
    expect(payload.searchCriteria?.periodEnd).toBe(dayjs('2026-01-02').startOf('day').toISOString());
    expect(payload.searchCriteria?.touchpoint).toBeUndefined();
    expect(payload.searchCriteria?.creditorInstitutionId).toBeUndefined();
  });
});
