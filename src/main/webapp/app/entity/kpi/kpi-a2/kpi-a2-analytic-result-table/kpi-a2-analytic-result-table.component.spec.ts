import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiA2AnalyticResultTableComponent } from './kpi-a2-analytic-result-table.component';

describe('KpiA2AnalyticResultTableComponent', () => {
  let component: KpiA2AnalyticResultTableComponent;
  let fixture: ComponentFixture<KpiA2AnalyticResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiA2AnalyticResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiA2AnalyticResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
