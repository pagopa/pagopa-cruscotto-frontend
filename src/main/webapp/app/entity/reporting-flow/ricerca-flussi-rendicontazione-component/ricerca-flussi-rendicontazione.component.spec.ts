import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RicercaFlussiRendicontazioneComponent } from './ricerca-flussi-rendicontazione.component';

describe('RicercaFlussiRendicontazioneComponent', () => {
  let component: RicercaFlussiRendicontazioneComponent;
  let fixture: ComponentFixture<RicercaFlussiRendicontazioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RicercaFlussiRendicontazioneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RicercaFlussiRendicontazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
