import { TestBed } from '@angular/core/testing';

import { KpiA2ResultService } from './kpi-a2-result.service';

describe('KpiA2ResultService', () => {
  let service: KpiA2ResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiA2ResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
