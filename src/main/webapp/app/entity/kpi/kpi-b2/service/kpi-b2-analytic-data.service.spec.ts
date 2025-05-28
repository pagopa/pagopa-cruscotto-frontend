import { TestBed } from '@angular/core/testing';

import { KpiB2AnalyticDataService } from './kpi-b2-analytic-data.service';

describe('KpiB2AnalyticDataService', () => {
  let service: KpiB2AnalyticDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB2AnalyticDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
