import { TestBed } from '@angular/core/testing';
import { KpiA2WrongTaxCodesService } from './kpi-a2-wrong-tax-codes.service';

describe('KpiA2WrongTaxCodesService', () => {
  let service: KpiA2WrongTaxCodesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiA2WrongTaxCodesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
