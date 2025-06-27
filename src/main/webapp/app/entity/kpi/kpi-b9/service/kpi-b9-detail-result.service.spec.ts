import { TestBed } from '@angular/core/testing';

import { KpiB9DetailResultService } from './kpi-b9-detail-result.service';

describe('KpiB9DetailResultService', () => {
  let service: KpiB9DetailResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB9DetailResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
