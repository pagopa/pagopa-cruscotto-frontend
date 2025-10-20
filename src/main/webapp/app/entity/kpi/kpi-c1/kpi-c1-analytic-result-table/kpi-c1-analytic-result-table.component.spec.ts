import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiC1AnalyticResultTableComponent } from './kpi-c1-analytic-result-table.component';

describe('KpiC1AnalyticResultTableComponent', () => {
  let component: KpiC1AnalyticResultTableComponent;
  let fixture: ComponentFixture<KpiC1AnalyticResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiC1AnalyticResultTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiC1AnalyticResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
