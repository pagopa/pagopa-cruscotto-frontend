import { TestBed } from '@angular/core/testing';

import { KpiB8ResultService } from './kpi-b8-result.service';

describe('KpiB8ResultService', () => {
  let service: KpiB8ResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB8ResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
