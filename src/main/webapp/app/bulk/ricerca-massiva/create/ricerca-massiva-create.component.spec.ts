import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { RicercaMassivaCreateComponent } from './ricerca-massiva-create.component';
import { BulkSearchService } from '../../services/bulk-search.service';
import { BulkLookupService } from '../../services/bulk-lookup.service';
import dayjs from '../../../config/dayjs';

describe('RicercaMassivaCreateComponent', () => {
  let fixture: ComponentFixture<RicercaMassivaCreateComponent>;
  let comp: RicercaMassivaCreateComponent;
  let bulkSearchService: BulkSearchService;
  let bulkLookupService: BulkLookupService;
  let router: Router;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [RicercaMassivaCreateComponent],
      providers: [
        { provide: Router, useValue: { navigate: jest.fn(), getCurrentNavigation: jest.fn(() => undefined) } },
        {
          provide: BulkLookupService,
          useValue: {
            touchpoints: jest.fn(() => of({ content: [] })),
            paymentMethods: jest.fn(() => of({ content: [] })),
            creditorInstitutions: jest.fn(() => of({ content: [] })),
            psp: jest.fn(() => of({ content: [] })),
            intermediaries: jest.fn(() => of({ content: [] })),
            intermediariesPsp: jest.fn(() => of({ content: [] })),
            stations: jest.fn(() => of({ content: [] })),
            channels: jest.fn(() => of({ content: [] })),
          },
        },
      ],
    })
      .overrideTemplate(RicercaMassivaCreateComponent, '')
      .createComponent(RicercaMassivaCreateComponent);

    comp = fixture.componentInstance;
    bulkSearchService = TestBed.inject(BulkSearchService);
    bulkLookupService = TestBed.inject(BulkLookupService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('renders the start/end time fields in 24h format without AM/PM text', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input[formControlName="periodStartTime"], input[formControlName="periodEndTime"]');

    expect(inputs).toHaveLength(2);
    expect(inputs[0].getAttribute('type')).toBe('text');
    expect(inputs[0].getAttribute('placeholder')).toBe('HH:mm');
    expect(inputs[0].getAttribute('inputmode')).toBe('numeric');
    expect(inputs[0].getAttribute('pattern')).toBe('^([01]\\d|2[0-3]):[0-5]\\d$');
    expect(inputs[1].getAttribute('type')).toBe('text');
    expect(inputs[1].getAttribute('placeholder')).toBe('HH:mm');
    expect(inputs[1].getAttribute('pattern')).toBe('^([01]\\d|2[0-3]):[0-5]\\d$');
  });

  it('is invalid when required fields are missing', () => {
    expect(comp.editForm.invalid).toBe(true);
  });

  it('loads the form options from the lookup endpoints', () => {
    expect(bulkLookupService.touchpoints).toHaveBeenCalledWith({ page: 0, size: 20 });
    expect(bulkLookupService.paymentMethods).toHaveBeenCalledWith({ page: 0, size: 20 });
    expect(bulkLookupService.creditorInstitutions).toHaveBeenCalledWith({ page: 0, size: 20 });
    expect(bulkLookupService.psp).toHaveBeenCalledWith({ page: 0, size: 20 });
    expect(bulkLookupService.intermediaries).toHaveBeenCalledWith({ page: 0, size: 20 });
    expect(bulkLookupService.intermediariesPsp).toHaveBeenCalledWith({ page: 0, size: 20 });
    expect(bulkLookupService.stations).toHaveBeenCalledWith({ page: 0, size: 20 });
    expect(bulkLookupService.channels).toHaveBeenCalledWith({ page: 0, size: 20 });
  });

  it('does not submit when the form is invalid', () => {
    jest.spyOn(bulkSearchService, 'create');

    comp.save();

    expect(bulkSearchService.create).not.toHaveBeenCalled();
  });

  it('submits only the filled search criteria when the form is valid', () => {
    jest.spyOn(bulkSearchService, 'create').mockReturnValue(of({ id: '1' }));
    comp.editForm.patchValue({
      name: 'Estrazione test',
      periodStartDate: dayjs('2026-01-01'),
      periodEndDate: dayjs('2026-01-02'),
      paymentOutcome: 'OK',
    });

    comp.save();

    expect(bulkSearchService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Estrazione test',
        inputType: 'FILTER',
        perimeterFilter: expect.objectContaining({ paymentStatuses: ['OK'] }),
      }),
    );
    expect(router.navigate).toHaveBeenCalledWith(['/bulk/ricerca-massiva']);
    expect(comp.isSaving).toBe(false);
  });

  it('shows an error and stays on the page when the save fails', () => {
    jest.spyOn(bulkSearchService, 'create').mockReturnValue(throwError(() => new Error('boom')));
    comp.editForm.patchValue({
      name: 'Estrazione test',
      periodStartDate: dayjs('2026-01-01'),
      periodEndDate: dayjs('2026-01-02'),
      paymentOutcome: 'OK',
    });

    comp.save();

    expect(comp.submitError).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('loads a detail instance in read-only mode when passed in navigation state', () => {
    (router.getCurrentNavigation as jest.Mock).mockReturnValue({
      extras: {
        state: {
          detailInstance: {
            id: 'instance-123',
            name: 'Dettaglio istanza',
            inputType: 'CSV',
            status: 'COMPLETED',
            perimeterFilter: {
              paymentStatuses: ['OK'],
              paymentPeriod: {
                from: '2026-01-01T00:00:00.000Z',
                to: '2026-01-02T00:00:00.000Z',
              },
            },
          },
        },
      },
    });

    const detailFixture = TestBed.createComponent(RicercaMassivaCreateComponent);

    expect(detailFixture.componentInstance.isReadOnly).toBe(true);
    expect(detailFixture.componentInstance.editForm.disabled).toBe(true);
    expect(detailFixture.componentInstance.editForm.get('name')?.value).toBe('Dettaglio istanza');
  });

  it('keeps a filter detail editable and updates the existing instance', () => {
    (router.getCurrentNavigation as jest.Mock).mockReturnValue({
      extras: {
        state: {
          detailInstance: {
            id: 'instance-123',
            inputType: 'FILTER',
            status: 'DRAFT',
            perimeterFilter: {},
          },
        },
      },
    });
    jest.spyOn(bulkSearchService, 'update').mockReturnValue(of({ id: 'instance-123' }));

    const detailFixture = TestBed.createComponent(RicercaMassivaCreateComponent);
    const detailComponent = detailFixture.componentInstance;
    detailComponent.editForm.patchValue({
      name: 'Filtro aggiornato',
      periodStartDate: dayjs('2026-01-01'),
      periodEndDate: dayjs('2026-01-02'),
      paymentOutcome: 'OK',
    });

    expect(detailComponent.isReadOnly).toBe(false);
    detailComponent.save();

    expect(bulkSearchService.update).toHaveBeenCalledWith('instance-123', expect.anything());
  });

  it('preserves duplicated lookup values when preloading lookup data', () => {
    (router.getCurrentNavigation as jest.Mock).mockReturnValue({
      extras: {
        state: {
          duplicateInstance: {
            id: 'instance-dup',
            name: 'Duplica filtro',
            inputType: 'FILTER',
            status: 'DRAFT',
            perimeterFilter: {
              paymentPeriod: {
                from: '2026-01-01T00:00:00.000Z',
                to: '2026-01-02T00:00:00.000Z',
              },
              creditors: [10],
              psps: [20],
              technologicalPartners: [30],
              stations: [40],
            },
          },
        },
      },
    });

    const lookupValues = {
      creditorInstitutions: { content: [{ id: 10, codice: 'CR001', description: 'Ente demo' }], last: true },
      psp: { content: [{ id: 20, codice: 'PSP001', description: 'PSP demo' }], last: true },
      intermediaries: { content: [{ id: 30, codice: 'INT001', description: 'Intermediario demo' }], last: true },
      intermediariesPsp: { content: [], last: true },
      stations: { content: [{ id: 40, codice: 'ST001' }], last: true },
      channels: { content: [], last: true },
      touchpoints: { content: [], last: true },
      paymentMethods: { content: [], last: true },
    };

    (bulkLookupService.creditorInstitutions as jest.Mock).mockReturnValue(of(lookupValues.creditorInstitutions));
    (bulkLookupService.psp as jest.Mock).mockReturnValue(of(lookupValues.psp));
    (bulkLookupService.intermediaries as jest.Mock).mockReturnValue(of(lookupValues.intermediaries));
    (bulkLookupService.intermediariesPsp as jest.Mock).mockReturnValue(of(lookupValues.intermediariesPsp));
    (bulkLookupService.stations as jest.Mock).mockReturnValue(of(lookupValues.stations));
    (bulkLookupService.channels as jest.Mock).mockReturnValue(of(lookupValues.channels));
    (bulkLookupService.touchpoints as jest.Mock).mockReturnValue(of(lookupValues.touchpoints));
    (bulkLookupService.paymentMethods as jest.Mock).mockReturnValue(of(lookupValues.paymentMethods));

    const duplicateFixture = TestBed.createComponent(RicercaMassivaCreateComponent);
    const duplicateComponent = duplicateFixture.componentInstance;

    expect(duplicateComponent.editForm.get('creditorInstitution')?.value?.id).toBe(10);
    expect(duplicateComponent.editForm.get('psp')?.value?.id).toBe(20);
    expect(duplicateComponent.editForm.get('intermediary')?.value?.id).toBe(30);
    expect(duplicateComponent.editForm.get('station')?.value?.id).toBe(40);
  });

  it('navigates back to the list on cancel', () => {
    comp.previousState();

    expect(router.navigate).toHaveBeenCalledWith(['/bulk/ricerca-massiva']);
  });
});
