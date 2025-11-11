import { TestBed } from '@angular/core/testing';
import { KpiC2ResultService } from './kpi-c2-result.service';

describe('KpiB2Service', () => {
  let service: KpiC2ResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiC2ResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
