import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BulkLookupService } from '../../services/bulk-lookup.service';
import { BulkLookupSelectComponent } from './bulk-lookup-select.component';

describe('BulkLookupSelectComponent', () => {
  let fixture: ComponentFixture<BulkLookupSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BulkLookupSelectComponent],
      providers: [
        {
          provide: BulkLookupService,
          useValue: {
            paymentMethods: jest.fn(() => of({ content: [], last: true })),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(BulkLookupSelectComponent);
    fixture.componentInstance.label = 'Metodo di pagamento';
    fixture.componentInstance.lookupType = 'paymentMethods';
    fixture.detectChanges();
  });

  it('shows the selected option text when disabled', () => {
    fixture.componentInstance.writeValue({ id: 1, codice: 'CARD', description: 'Carta' });
    fixture.componentInstance.setDisabledState(true);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.mat-mdc-select-trigger');

    expect(trigger.textContent).toContain('CARD - Carta');
  });
});
