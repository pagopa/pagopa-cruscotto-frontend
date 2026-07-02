import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RicercaOperazioniComponent } from './ricerca-operazioni.component';

describe('RicercaOperazioniComponent', () => {
  let component: RicercaOperazioniComponent;
  let fixture: ComponentFixture<RicercaOperazioniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RicercaOperazioniComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RicercaOperazioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should restore the search form from the persisted filter state', () => {
    component.searchForm.patchValue({
      paEmittente: '12345678901',
      nav: '987654321',
      iuv: 'ABC123',
      token: '0123456789abcdef0123456789abcdef',
      idCarrello: 'cart-001',
      extra: 'extra-value',
    });

    (component as any).populateFilter();
    component.searchForm.reset();
    (component as any).updateForm();

    expect(component.searchForm.value).toMatchObject({
      paEmittente: '12345678901',
      nav: '987654321',
      iuv: 'ABC123',
      token: '0123456789abcdef0123456789abcdef',
      idCarrello: 'cart-001',
      extra: 'extra-value',
    });
  });
});
