import { TestBed } from '@angular/core/testing';

import { KpiA1ResultService } from './kpi-a1-result.service';

describe('KpiA1ResultService', () => {
  let service: KpiA1ResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiA1ResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
