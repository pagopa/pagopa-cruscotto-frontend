import { TestBed } from '@angular/core/testing';

import { KpiA1DetailResultService } from './kpi-a1-detail-result.service';

describe('KpiA1DetailResultService', () => {
  let service: KpiA1DetailResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiA1DetailResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
