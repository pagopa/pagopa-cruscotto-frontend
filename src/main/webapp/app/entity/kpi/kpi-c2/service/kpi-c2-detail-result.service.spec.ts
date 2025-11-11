import { TestBed } from '@angular/core/testing';
import { KpiC2DetailResultService } from './kpi-c2-detail-result.service';

describe('KpiC2DetailResultService', () => {
  let service: KpiC2DetailResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiC2DetailResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
