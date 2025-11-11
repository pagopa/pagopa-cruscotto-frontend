import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpiC2DetailResultTableComponent } from './kpi-c2-detail-result-table.component';

describe('KpiC2DetailResultTableComponent', () => {
  let component: KpiC2DetailResultTableComponent;
  let fixture: ComponentFixture<KpiC2DetailResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiC2DetailResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiC2DetailResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
