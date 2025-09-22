import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB9AnalyticDrilldownTableComponent } from './kpi-b9-analytic-drilldown-table.component';

describe('KpiB9AnalyticDrilldownTableComponent', () => {
  let component: KpiB9AnalyticDrilldownTableComponent;
  let fixture: ComponentFixture<KpiB9AnalyticDrilldownTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB9AnalyticDrilldownTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiB9AnalyticDrilldownTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
