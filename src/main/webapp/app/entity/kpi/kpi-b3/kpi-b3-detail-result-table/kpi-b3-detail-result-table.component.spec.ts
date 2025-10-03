import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB3DetailResultTableComponent } from './kpi-b3-detail-result-table.component';

describe('KpiB3DetailResultTableComponent', () => {
  let component: KpiB3DetailResultTableComponent;
  let fixture: ComponentFixture<KpiB3DetailResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB3DetailResultTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiB3DetailResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
