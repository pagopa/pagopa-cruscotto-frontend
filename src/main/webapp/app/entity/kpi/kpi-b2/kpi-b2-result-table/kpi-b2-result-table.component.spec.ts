import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB2ResultTableComponent } from './kpi-b2-result-table.component';

describe('KpiB2ResultTableComponent', () => {
  let component: KpiB2ResultTableComponent;
  let fixture: ComponentFixture<KpiB2ResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB2ResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiB2ResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
