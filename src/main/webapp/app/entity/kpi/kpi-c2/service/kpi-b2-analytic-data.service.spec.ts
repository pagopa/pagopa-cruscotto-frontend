import { TestBed } from '@angular/core/testing';
import { KpiC2AnalyticDataService } from './kpi-c2-analytic-data.service';

describe('kpiC2AnalyticDataService', () => {
  let service: KpiC2AnalyticDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiC2AnalyticDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
