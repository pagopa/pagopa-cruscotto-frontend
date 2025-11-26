import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiA1RecordedTimeoutTableComponent } from './kpi-a1-recorded-timeout-table.component';

describe('KpiA1RecordedTimeoutTableComponent', () => {
  let component: KpiA1RecordedTimeoutTableComponent;
  let fixture: ComponentFixture<KpiA1RecordedTimeoutTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiA1RecordedTimeoutTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiA1RecordedTimeoutTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
