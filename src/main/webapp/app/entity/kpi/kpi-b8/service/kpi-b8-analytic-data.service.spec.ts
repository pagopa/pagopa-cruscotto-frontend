import { TestBed } from '@angular/core/testing';

import { KpiB8AnalyticDataService } from './kpi-b8-analytic-data.service';

describe('KpiB8AnalyticDataService', () => {
  let service: KpiB8AnalyticDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB8AnalyticDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
