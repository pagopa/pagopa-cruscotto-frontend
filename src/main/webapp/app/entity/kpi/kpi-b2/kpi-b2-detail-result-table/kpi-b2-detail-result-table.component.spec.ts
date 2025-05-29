import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB2DetailResultTableComponent } from './kpi-b2-detail-result-table.component';

describe('KpiB2DetailResultTableComponent', () => {
  let component: KpiB2DetailResultTableComponent;
  let fixture: ComponentFixture<KpiB2DetailResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB2DetailResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiB2DetailResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
