import { TestBed } from '@angular/core/testing';

import { KpiC1IODrilldownService } from './kpi-c1-io-drilldown.service';

describe('KpiC1IODrilldownService', () => {
  let service: KpiC1IODrilldownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiC1IODrilldownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
