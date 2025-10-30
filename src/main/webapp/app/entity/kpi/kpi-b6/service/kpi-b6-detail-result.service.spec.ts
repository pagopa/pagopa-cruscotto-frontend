import { TestBed } from '@angular/core/testing';

import { KpiB6DetailResultService } from './kpi-b6-detail-result.service';

describe('KpiB6DetailResultService', () => {
  let service: KpiB6DetailResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB6DetailResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
