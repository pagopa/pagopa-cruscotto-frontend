import { TestBed } from '@angular/core/testing';

import { KpiC1AnalyticDataService } from './kpi-c1-analytic-data.service';

describe('KpiC1AnalyticDataService', () => {
  let service: KpiC1AnalyticDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiC1AnalyticDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
