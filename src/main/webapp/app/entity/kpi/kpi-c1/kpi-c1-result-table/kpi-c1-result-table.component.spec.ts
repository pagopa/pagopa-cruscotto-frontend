import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiC1ResultTableComponent } from './kpi-c1-result-table.component';

describe('KpiC1ResultTableComponent', () => {
  let component: KpiC1ResultTableComponent;
  let fixture: ComponentFixture<KpiC1ResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiC1ResultTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiC1ResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
