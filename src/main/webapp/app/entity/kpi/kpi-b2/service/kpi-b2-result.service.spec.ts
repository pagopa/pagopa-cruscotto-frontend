import { TestBed } from '@angular/core/testing';

import { KpiB2ResultService } from './kpi-b2-result.service';

describe('KpiB2Service', () => {
  let service: KpiB2ResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB2ResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
