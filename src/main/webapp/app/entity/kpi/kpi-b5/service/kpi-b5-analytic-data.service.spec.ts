import { TestBed } from '@angular/core/testing';

import { KpiB5AnalyticDataService } from './kpi-b5-analytic-data.service';

describe('KpiB5AnalyticDataService', () => {
  let service: KpiB5AnalyticDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB5AnalyticDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
