import { TestBed } from '@angular/core/testing';

import { KpiB9ResultService } from './kpi-b9-result.service';

describe('KpiB9ResultService', () => {
  let service: KpiB9ResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiB9ResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
