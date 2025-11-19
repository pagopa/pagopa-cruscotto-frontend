import { TestBed } from '@angular/core/testing';

import { KpiB5DetailResultService } from './kpi-b5-detail-result.service';

describe('KpiB5DetailResultService', () => {
  let service: KpiB5DetailResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB5DetailResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
