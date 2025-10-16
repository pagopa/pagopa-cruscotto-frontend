import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB4AnalyticResultTableComponent } from './kpi-b4-analytic-result-table.component';

describe('KpiB4AnalyticResultTableComponent', () => {
  let component: KpiB4AnalyticResultTableComponent;
  let fixture: ComponentFixture<KpiB4AnalyticResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB4AnalyticResultTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiB4AnalyticResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
