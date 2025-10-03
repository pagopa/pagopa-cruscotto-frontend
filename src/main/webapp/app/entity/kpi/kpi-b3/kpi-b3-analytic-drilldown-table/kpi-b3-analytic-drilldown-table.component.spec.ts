import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB3AnalyticDrilldownTableComponent } from './kpi-b3-analytic-drilldown-table.component';

describe('KpiB3AnalyticDrilldownTableComponent', () => {
  let component: KpiB3AnalyticDrilldownTableComponent;
  let fixture: ComponentFixture<KpiB3AnalyticDrilldownTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB3AnalyticDrilldownTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiB3AnalyticDrilldownTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
