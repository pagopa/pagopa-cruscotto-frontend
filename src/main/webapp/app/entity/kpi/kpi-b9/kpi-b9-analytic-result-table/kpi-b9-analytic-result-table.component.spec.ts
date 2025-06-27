import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB9AnalyticResultTableComponent } from './kpi-b9-analytic-result-table.component';

describe('KpiB9AnalyticResultTableComponent', () => {
  let component: KpiB9AnalyticResultTableComponent;
  let fixture: ComponentFixture<KpiB9AnalyticResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB9AnalyticResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiB9AnalyticResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
