import { TestBed } from '@angular/core/testing';

import { KpiB6ResultService } from './kpi-b6-result.service';

describe('KpiB6ResultService', () => {
  let service: KpiB6ResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB6ResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
