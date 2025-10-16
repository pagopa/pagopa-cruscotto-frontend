import { TestBed } from '@angular/core/testing';

import { KpiB4PagopaDataDrilldownService } from './kpi-b4-pagopa-data-drilldown.service';

describe('KpiB4PagopaDataDrilldownService', () => {
  let service: KpiB4PagopaDataDrilldownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB4PagopaDataDrilldownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
