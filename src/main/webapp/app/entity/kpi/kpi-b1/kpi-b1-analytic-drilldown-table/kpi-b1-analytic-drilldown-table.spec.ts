import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpiB1AnalyticDrilldownTableComponent } from './kpi-b1-analytic-drilldown-table.component';

describe('KpiB1AnalyticDrilldownTableComponent', () => {
  let component: KpiB1AnalyticDrilldownTableComponent;
  let fixture: ComponentFixture<KpiB1AnalyticDrilldownTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB1AnalyticDrilldownTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiB1AnalyticDrilldownTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
