import { ComponentFixture, TestBed } from '@angular/core/testing';
import dayjs from '../../../../config/dayjs';

import { RicercaOperazioniComponent } from './ricerca-operazioni.component';

describe('RicercaOperazioniComponent', () => {
  let component: RicercaOperazioniComponent;
  let fixture: ComponentFixture<RicercaOperazioniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RicercaOperazioniComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RicercaOperazioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should restore the search form from the persisted filter state', () => {
    component.searchForm.patchValue({
      paEmittente: '12345678901',
      nav: '987654321',
      iuv: 'ABC123',
      token: '0123456789abcdef0123456789abcdef',
      idCarrello: 'cart-001',
      extra: 'extra-value',
    });

    (component as any).populateFilter();
    component.searchForm.reset();
    (component as any).updateForm();

    expect(component.searchForm.value).toMatchObject({
      paEmittente: '12345678901',
      nav: '987654321',
      iuv: 'ABC123',
      token: '0123456789abcdef0123456789abcdef',
      idCarrello: 'cart-001',
      extra: 'extra-value',
    });
  });

  it('should require an issuing PA, a NAV, or both', () => {
    component.searchForm.patchValue({ iuv: 'IUV-123' });
    expect(component.searchForm.hasError('paEmittenteOrNavRequired')).toBe(true);

    component.searchForm.patchValue({ iuv: '', nav: '123456789' });
    expect(component.searchForm.hasError('paEmittenteOrNavRequired')).toBe(false);

    component.searchForm.patchValue({ nav: '', paEmittente: '12345678901' });
    expect(component.searchForm.hasError('paEmittenteOrNavRequired')).toBe(false);

    component.searchForm.patchValue({ nav: '123456789' });
    expect(component.searchForm.hasError('paEmittenteOrNavRequired')).toBe(false);
  });

  it('should require both dates when searching history', () => {
    component.searchForm.patchValue({ paEmittente: '12345678901', fromHistory: true });
    expect(component.searchForm.hasError('dateFromOrDateToRequired')).toBe(true);

    component.searchForm.controls.dateFrom.setValue(dayjs('2024-01-01'));
    expect(component.searchForm.hasError('dateFromOrDateToRequired')).toBe(true);

    component.searchForm.controls.dateTo.setValue(dayjs('2024-02-01'));
    expect(component.searchForm.hasError('dateFromOrDateToRequired')).toBe(false);

    component.searchForm.patchValue({ fromHistory: false, dateFrom: null, dateTo: null });
    expect(component.searchForm.hasError('dateFromOrDateToRequired')).toBe(false);
  });

  it('should allow only months from 42 to 6 months before now', () => {
    const monthBeforeMin = new Date(component.minDate.getFullYear(), component.minDate.getMonth() - 1, 1);
    const monthAfterMax = new Date(component.maxDate.getFullYear(), component.maxDate.getMonth() + 1, 1);

    expect(component.dpFilter(component.minDate)).toBe(true);
    expect(component.dpFilter(component.maxDate)).toBe(true);
    expect(component.dpFilter(monthBeforeMin)).toBe(false);
    expect(component.dpFilter(monthAfterMax)).toBe(false);
    expect(component.dpFilter(null)).toBe(false);
  });

  it('should clear the result set when a history search parameter changes', () => {
    const changedParameters = [
      () => component.searchForm.controls.fromHistory.setValue(true),
      () => component.searchForm.controls.fromOnline.setValue(true),
      () => component.searchForm.controls.dateFrom.setValue(dayjs('2024-01-01')),
      () => component.searchForm.controls.dateTo.setValue(dayjs('2024-02-01')),
    ];

    changedParameters.forEach(changeParameter => {
      component.data = [{ paEmittente: '12345678901', numeroAvviso: '987654321', positionId: '12345678901_987654321' }];
      component.resultsLength = 1;

      changeParameter();

      expect(component.data).toEqual([]);
      expect(component.resultsLength).toBe(0);
    });
  });
});
