import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiA2ResultTableComponent } from './kpi-a2-result-table.component';

describe('KpiA2ResultTableComponent', () => {
  let component: KpiA2ResultTableComponent;
  let fixture: ComponentFixture<KpiA2ResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiA2ResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiA2ResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
