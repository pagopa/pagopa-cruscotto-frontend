import { TestBed } from '@angular/core/testing';

import { KpiC1PagopaDataDrilldownService } from './kpi-c1-pagopa-data-drilldown.service';

describe('KpiC1PagopaDataDrilldownService', () => {
  let service: KpiC1PagopaDataDrilldownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiC1PagopaDataDrilldownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
