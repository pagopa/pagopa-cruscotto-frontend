import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB6AnalyticResultTableComponent } from './kpi-b6-analytic-result-table.component';

describe('KpiB6AnalyticResultTableComponent', () => {
  let component: KpiB6AnalyticResultTableComponent;
  let fixture: ComponentFixture<KpiB6AnalyticResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB6AnalyticResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiB6AnalyticResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
