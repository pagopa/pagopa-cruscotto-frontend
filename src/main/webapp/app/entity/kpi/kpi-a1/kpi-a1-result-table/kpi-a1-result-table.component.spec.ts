import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiA1ResultTableComponent } from './kpi-a1-result-table.component';

describe('KpiA1ResultTableComponent', () => {
  let component: KpiA1ResultTableComponent;
  let fixture: ComponentFixture<KpiA1ResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiA1ResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiA1ResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
