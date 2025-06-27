import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiA1DetailResultTableComponent } from './kpi-a1-detail-result-table.component';

describe('KpiA1DetailResultTableComponent', () => {
  let component: KpiA1DetailResultTableComponent;
  let fixture: ComponentFixture<KpiA1DetailResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiA1DetailResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiA1DetailResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
