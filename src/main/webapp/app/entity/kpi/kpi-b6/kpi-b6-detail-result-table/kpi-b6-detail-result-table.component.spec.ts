import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB6DetailResultTableComponent } from './kpi-b6-detail-result-table.component';

describe('KpiB6DetailResultTableComponent', () => {
  let component: KpiB6DetailResultTableComponent;
  let fixture: ComponentFixture<KpiB6DetailResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB6DetailResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiB6DetailResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
