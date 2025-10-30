import { TestBed } from '@angular/core/testing';
import { KpiB6AnalyticDrilldownService } from './kpi-b6-pagopa-data-drilldown.service';

describe('kpiB6AnalyticDrilldownService', () => {
  let service: KpiB6AnalyticDrilldownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB6AnalyticDrilldownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
