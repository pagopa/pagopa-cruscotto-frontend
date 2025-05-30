import { TestBed } from '@angular/core/testing';

import { KpiB9AnalyticDataService } from './kpi-b9-analytic-data.service';

describe('KpiB9AnalyticDataService', () => {
  let service: KpiB9AnalyticDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB9AnalyticDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
