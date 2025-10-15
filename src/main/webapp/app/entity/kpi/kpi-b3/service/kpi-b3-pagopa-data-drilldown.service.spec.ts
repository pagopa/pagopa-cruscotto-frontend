import { TestBed } from '@angular/core/testing';

import { KpiB3PagopaDataDrilldownService } from './kpi-b3-pagopa-data-drilldown.service';

describe('KpiB3PagopaDataDrilldownService', () => {
  let service: KpiB3PagopaDataDrilldownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB3PagopaDataDrilldownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
