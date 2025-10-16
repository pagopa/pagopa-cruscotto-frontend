import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB1DetailResultTableComponent } from './kpi-b1-detail-result-table.component';

describe('KpiB1DetailResultTableComponent', () => {
  let component: KpiB1DetailResultTableComponent;
  let fixture: ComponentFixture<KpiB1DetailResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB1DetailResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiB1DetailResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
