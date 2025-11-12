import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB5AnalyticResultTableComponent } from './kpi-b5-analytic-result-table.component';

describe('KpiB5AnalyticResultTableComponent', () => {
  let component: KpiB5AnalyticResultTableComponent;
  let fixture: ComponentFixture<KpiB5AnalyticResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB5AnalyticResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiB5AnalyticResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
