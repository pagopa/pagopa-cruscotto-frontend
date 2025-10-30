import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB5ResultTableComponent } from './kpi-b5-result-table.component';

describe('KpiB5ResultTableComponent', () => {
  let component: KpiB5ResultTableComponent;
  let fixture: ComponentFixture<KpiB5ResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB5ResultTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiB5ResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
