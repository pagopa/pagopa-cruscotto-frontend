import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiC1AnalyticDrilldownTableComponent } from './kpi-c1-analytic-drilldown-table.component';

describe('KpiC1AnalyticDrilldownTableComponent', () => {
  let component: KpiC1AnalyticDrilldownTableComponent;
  let fixture: ComponentFixture<KpiC1AnalyticDrilldownTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiC1AnalyticDrilldownTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiC1AnalyticDrilldownTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
