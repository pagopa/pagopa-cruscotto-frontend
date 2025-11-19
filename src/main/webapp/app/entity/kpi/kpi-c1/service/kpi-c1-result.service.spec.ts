import { TestBed } from '@angular/core/testing';

import { KpiC1ResultService } from './kpi-c1-result.service';

describe('KpiC1ResultService', () => {
  let service: KpiC1ResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiC1ResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
