import { TestBed } from '@angular/core/testing';

import { KpiC1DetailResultService } from './kpi-c1-detail-result.service';

describe('KpiC1DetailResultService', () => {
  let service: KpiC1DetailResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiC1DetailResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
