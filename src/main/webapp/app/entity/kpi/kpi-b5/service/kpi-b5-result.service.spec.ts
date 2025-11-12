import { TestBed } from '@angular/core/testing';

import { KpiB5ResultService } from './kpi-b5-result.service';

describe('KpiB5ResultService', () => {
  let service: KpiB5ResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB5ResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
