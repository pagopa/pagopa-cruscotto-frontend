import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB5DetailResultTableComponent } from './kpi-b5-detail-result-table.component';

describe('KpiB5DetailResultTableComponent', () => {
  let component: KpiB5DetailResultTableComponent;
  let fixture: ComponentFixture<KpiB5DetailResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB5DetailResultTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiB5DetailResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
