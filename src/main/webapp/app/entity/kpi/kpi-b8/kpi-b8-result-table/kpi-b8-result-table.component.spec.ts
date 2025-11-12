import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB8ResultTableComponent } from './kpi-b8-result-table.component';

describe('KpiB8ResultTableComponent', () => {
  let component: KpiB8ResultTableComponent;
  let fixture: ComponentFixture<KpiB8ResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB8ResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiB8ResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
