import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB6ResultTableComponent } from './kpi-b6-result-table.component';

describe('KpiB6ResultTableComponent', () => {
  let component: KpiB6ResultTableComponent;
  let fixture: ComponentFixture<KpiB6ResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB6ResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiB6ResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
