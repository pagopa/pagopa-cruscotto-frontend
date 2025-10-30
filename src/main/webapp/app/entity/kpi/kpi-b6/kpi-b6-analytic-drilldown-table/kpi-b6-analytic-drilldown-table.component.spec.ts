import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB4AnalyticDrilldownTableComponent } from './kpi-b6-analytic-drilldown-table.component';

describe('KpiB4AnalyticDrilldownTableComponent', () => {
  let component: KpiB4AnalyticDrilldownTableComponent;
  let fixture: ComponentFixture<KpiB4AnalyticDrilldownTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB4AnalyticDrilldownTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiB4AnalyticDrilldownTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
