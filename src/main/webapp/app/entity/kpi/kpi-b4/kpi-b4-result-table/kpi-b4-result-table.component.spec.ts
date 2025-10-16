import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB4ResultTableComponent } from './kpi-b4-result-table.component';

describe('KpiB4ResultTableComponent', () => {
  let component: KpiB4ResultTableComponent;
  let fixture: ComponentFixture<KpiB4ResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB4ResultTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiB4ResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
