import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('KpiB1ResultTableComponent', () => {
  let component: KpiB1ResultTableComponent;
  let fixture: ComponentFixture<KpiB1ResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiB1ResultTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiB1ResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
