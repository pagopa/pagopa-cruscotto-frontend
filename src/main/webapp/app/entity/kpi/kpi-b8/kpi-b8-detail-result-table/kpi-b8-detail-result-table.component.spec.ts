import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB8DetailResultTableComponent } from './kpi-b8-detail-result-table.component';

describe('KpiB8DetailResultTableComponent', () => {
  let component: KpiB8DetailResultTableComponent;
  let fixture: ComponentFixture<KpiB8DetailResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB8DetailResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiB8DetailResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
