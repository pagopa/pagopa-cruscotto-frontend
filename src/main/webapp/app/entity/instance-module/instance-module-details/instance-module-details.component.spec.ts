import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceModuleDetailsComponent } from './instance-module-details.component';

describe('InstanceModuleDetailsComponent', () => {
  let component: InstanceModuleDetailsComponent;
  let fixture: ComponentFixture<InstanceModuleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstanceModuleDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstanceModuleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
