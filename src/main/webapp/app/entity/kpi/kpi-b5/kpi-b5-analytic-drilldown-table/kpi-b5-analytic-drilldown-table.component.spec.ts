import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB5AnalyticDrilldownTableComponent } from './kpi-b5-analytic-drilldown-table.component';

describe('KpiB5AnalyticDrilldownTableComponent', () => {
  let component: KpiB5AnalyticDrilldownTableComponent;
  let fixture: ComponentFixture<KpiB5AnalyticDrilldownTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB5AnalyticDrilldownTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiB5AnalyticDrilldownTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
