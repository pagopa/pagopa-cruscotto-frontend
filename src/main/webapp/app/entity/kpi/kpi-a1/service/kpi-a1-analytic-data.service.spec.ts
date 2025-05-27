import { TestBed } from '@angular/core/testing';

import { KpiA1AnalyticDataService } from './kpi-a1-analytic-data.service';

describe('KpiA1AnalyticDataService', () => {
  let service: KpiA1AnalyticDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiA1AnalyticDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
