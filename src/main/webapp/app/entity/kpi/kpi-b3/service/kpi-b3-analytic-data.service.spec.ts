import { TestBed } from '@angular/core/testing';

import { KpiB3AnalyticDataService } from './kpi-b3-analytic-data.service';

describe('KpiB3AnalyticDataService', () => {
  let service: KpiB3AnalyticDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB3AnalyticDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
