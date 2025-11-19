import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpiC2AnalyticResultTableComponent } from './kpi-c2-analytic-result-table.component';

describe('KpiC2AnalyticResultTableComponent', () => {
  let component: KpiC2AnalyticResultTableComponent;
  let fixture: ComponentFixture<KpiC2AnalyticResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiC2AnalyticResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiC2AnalyticResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
