import { TestBed } from '@angular/core/testing';

import { KpiB5PagopaDataDrilldownService } from './kpi-b5-pagopa-data-drilldown.service';

describe('KpiB5PagopaDataDrilldownService', () => {
  let service: KpiB5PagopaDataDrilldownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB5PagopaDataDrilldownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
