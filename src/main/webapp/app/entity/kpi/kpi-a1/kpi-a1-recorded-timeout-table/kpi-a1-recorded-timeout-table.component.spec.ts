import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiA1AnalyticResultTableComponent } from './kpi-a1-recorded-timeout-table.component';

describe('KpiA1AnalyticResultTableComponent', () => {
  let component: KpiA1AnalyticResultTableComponent;
  let fixture: ComponentFixture<KpiA1AnalyticResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiA1AnalyticResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiA1AnalyticResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
