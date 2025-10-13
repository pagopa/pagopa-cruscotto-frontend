import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB8AnalyticResultTableComponent } from './kpi-b8-analytic-result-table.component';

describe('KpiB8AnalyticResultTableComponent', () => {
  let component: KpiB8AnalyticResultTableComponent;
  let fixture: ComponentFixture<KpiB8AnalyticResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB8AnalyticResultTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiB8AnalyticResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
