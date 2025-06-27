import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB9DetailResultTableComponent } from './kpi-b9-detail-result-table.component';

describe('KpiB9DetailResultTableComponent', () => {
  let component: KpiB9DetailResultTableComponent;
  let fixture: ComponentFixture<KpiB9DetailResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB9DetailResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiB9DetailResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
