import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB3AnalyticResultTableComponent } from './kpi-b3-analytic-result-table.component';

describe('KpiB3AnalyticResultTableComponent', () => {
  let component: KpiB3AnalyticResultTableComponent;
  let fixture: ComponentFixture<KpiB3AnalyticResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB3AnalyticResultTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiB3AnalyticResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
