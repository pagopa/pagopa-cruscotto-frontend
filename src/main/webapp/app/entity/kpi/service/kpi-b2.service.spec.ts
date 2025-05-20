import { TestBed } from '@angular/core/testing';

import { KpiB2Service } from './kpi-b2.service';

describe('KpiB2Service', () => {
  let service: KpiB2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
