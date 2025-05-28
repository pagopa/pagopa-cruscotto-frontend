import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiA2DetailResultTableComponent } from './kpi-a2-detail-result-table.component';

describe('KpiA2DetailResultTableComponent', () => {
  let component: KpiA2DetailResultTableComponent;
  let fixture: ComponentFixture<KpiA2DetailResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiA2DetailResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiA2DetailResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
