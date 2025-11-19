import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiC1DetailResultTableComponent } from './kpi-c1-detail-result-table.component';

describe('KpiC1DetailResultTableComponent', () => {
  let component: KpiC1DetailResultTableComponent;
  let fixture: ComponentFixture<KpiC1DetailResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiC1DetailResultTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiC1DetailResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
