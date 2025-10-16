import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB4DetailResultTableComponent } from './kpi-b4-detail-result-table.component';

describe('KpiB4DetailResultTableComponent', () => {
  let component: KpiB4DetailResultTableComponent;
  let fixture: ComponentFixture<KpiB4DetailResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB4DetailResultTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiB4DetailResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
