import { TestBed } from '@angular/core/testing';

import { KpiB4DetailResultService } from './kpi-b4-detail-result.service';

describe('KpiB4DetailResultService', () => {
  let service: KpiB4DetailResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB4DetailResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
