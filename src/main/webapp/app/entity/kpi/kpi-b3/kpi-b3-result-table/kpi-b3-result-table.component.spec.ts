import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiB3ResultTableComponent } from './kpi-b3-result-table.component';

describe('KpiB3ResultTableComponent', () => {
  let component: KpiB3ResultTableComponent;
  let fixture: ComponentFixture<KpiB3ResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB3ResultTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiB3ResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
