import { TestBed } from '@angular/core/testing';

import { KpiA2DetailResultService } from './kpi-a2-detail-result.service';

describe('KpiA2DetailResultService', () => {
  let service: KpiA2DetailResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiA2DetailResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
