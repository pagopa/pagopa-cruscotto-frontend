import { TestBed } from '@angular/core/testing';

import { KpiB8DetailResultService } from './kpi-b8-detail-result.service';

describe('KpiB8DetailResultService', () => {
  let service: KpiB8DetailResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB8DetailResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
