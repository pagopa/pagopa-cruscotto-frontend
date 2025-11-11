import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiC2ResultTableComponent } from './kpi-c2-result-table.component';

describe('KpiC2ResultTableComponent', () => {
  let component: KpiC2ResultTableComponent;
  let fixture: ComponentFixture<KpiC2ResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiC2ResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiC2ResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
