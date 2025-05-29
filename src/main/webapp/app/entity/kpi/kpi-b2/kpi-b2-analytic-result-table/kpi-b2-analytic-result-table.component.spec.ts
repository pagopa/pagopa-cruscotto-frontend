import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB2AnalyticResultTableComponent } from './kpi-b2-analytic-result-table.component';

describe('KpiB2AnalyticResultTableComponent', () => {
  let component: KpiB2AnalyticResultTableComponent;
  let fixture: ComponentFixture<KpiB2AnalyticResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB2AnalyticResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiB2AnalyticResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
