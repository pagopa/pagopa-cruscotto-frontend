import { TestBed } from '@angular/core/testing';

import { KpiB2DetailResultService } from './kpi-b2-detail-result.service';

describe('KpiB2DetailResultService', () => {
  let service: KpiB2DetailResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB2DetailResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
