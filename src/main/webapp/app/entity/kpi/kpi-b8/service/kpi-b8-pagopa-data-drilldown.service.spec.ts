import { TestBed } from '@angular/core/testing';

import { KpiB8PagopaDataDrilldownService } from './kpi-b8-pagopa-data-drilldown.service';

describe('KpiB8PagopaDataDrilldownService', () => {
  let service: KpiB8PagopaDataDrilldownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB8PagopaDataDrilldownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
