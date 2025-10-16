import { TestBed } from '@angular/core/testing';

import { KpiB4ResultService } from './kpi-b4-result.service';

describe('KpiB4ResultService', () => {
  let service: KpiB4ResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB4ResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
