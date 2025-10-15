import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB1AnalyticResultTableComponent } from './kpi-b1-analytic-result-table.component';

describe('KpiB1AnalyticResultTableComponent', () => {
  let component: KpiB1AnalyticResultTableComponent;
  let fixture: ComponentFixture<KpiB1AnalyticResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB1AnalyticResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiB1AnalyticResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
