import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB8AnalyticDrilldownTableComponent } from './kpi-b8-analytic-drilldown-table.component';

describe('KpiB8AnalyticDrilldownTableComponent', () => {
  let component: KpiB8AnalyticDrilldownTableComponent;
  let fixture: ComponentFixture<KpiB8AnalyticDrilldownTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB8AnalyticDrilldownTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiB8AnalyticDrilldownTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
