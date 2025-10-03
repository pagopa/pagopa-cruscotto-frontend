import { TestBed } from '@angular/core/testing';

import { KpiB3DetailResultService } from './kpi-b3-detail-result.service';

describe('KpiB3DetailResultService', () => {
  let service: KpiB3DetailResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB3DetailResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
