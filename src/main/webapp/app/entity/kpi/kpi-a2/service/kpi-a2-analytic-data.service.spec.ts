import { TestBed } from '@angular/core/testing';

import { KpiA2AnalyticDataService } from './kpi-a2-analytic-data.service';

describe('KpiA2AnalyticDataService', () => {
  let service: KpiA2AnalyticDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiA2AnalyticDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
