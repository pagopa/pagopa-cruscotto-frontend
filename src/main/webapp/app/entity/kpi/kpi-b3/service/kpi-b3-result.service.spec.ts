import { TestBed } from '@angular/core/testing';

import { KpiB3ResultService } from './kpi-b3-result.service';

describe('KpiB3ResultService', () => {
  let service: KpiB3ResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB3ResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
