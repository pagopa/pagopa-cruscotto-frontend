import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiA2AnalyticDrilldownTableComponent } from './kpi-a2-analytic-drilldown-table.component';

describe('KpiA2AnalyticDrilldownTableComponent', () => {
  let component: KpiA2AnalyticDrilldownTableComponent;
  let fixture: ComponentFixture<KpiA2AnalyticDrilldownTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiA2AnalyticDrilldownTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiA2AnalyticDrilldownTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
