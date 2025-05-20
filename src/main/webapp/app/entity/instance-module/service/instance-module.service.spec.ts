import { TestBed } from '@angular/core/testing';

import { InstanceModuleService } from './instance-module.service';

describe('InstanceModuleService', () => {
  let service: InstanceModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstanceModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
