import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpiC2AnalyticDrilldownTableComponent } from './kpi-c2-analytic-drilldown-table.component';

describe('KpiC2AnalyticResultTableComponent', () => {
  let component: KpiC2AnalyticDrilldownTableComponent;
  let fixture: ComponentFixture<KpiC2AnalyticDrilldownTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiC2AnalyticDrilldownTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiC2AnalyticDrilldownTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
