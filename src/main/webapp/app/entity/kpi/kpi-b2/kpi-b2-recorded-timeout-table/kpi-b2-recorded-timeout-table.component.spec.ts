import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB2RecordedTimeoutTableComponent } from './kpi-b2-recorded-timeout-table.component';

describe('KpiA1AnalyticResultTableComponent', () => {
  let component: KpiB2RecordedTimeoutTableComponent;
  let fixture: ComponentFixture<KpiB2RecordedTimeoutTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB2RecordedTimeoutTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiB2RecordedTimeoutTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
