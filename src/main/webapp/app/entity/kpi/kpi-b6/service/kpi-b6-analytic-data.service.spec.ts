import { TestBed } from '@angular/core/testing';

import { KpiB4AnalyticDataService } from './kpi-b6-analytic-data.service';

describe('KpiB4AnalyticDataService', () => {
  let service: KpiB4AnalyticDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB4AnalyticDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
