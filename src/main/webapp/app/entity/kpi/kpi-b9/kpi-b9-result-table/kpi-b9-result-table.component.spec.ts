import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB9ResultTableComponent } from './kpi-b9-result-table.component';

describe('KpiB9ResultTableComponent', () => {
  let component: KpiB9ResultTableComponent;
  let fixture: ComponentFixture<KpiB9ResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB9ResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiB9ResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
