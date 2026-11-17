import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RicercaFlussiRendicontazioneDetailComponent } from './ricerca-flussi-rendicontazione-detail.component';

describe('RicercaFlussiRendicontazioneDetailComponent', () => {
  let component: RicercaFlussiRendicontazioneDetailComponent;
  let fixture: ComponentFixture<RicercaFlussiRendicontazioneDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RicercaFlussiRendicontazioneDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RicercaFlussiRendicontazioneDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
