import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { RicercaMassivaCreateComponent } from './ricerca-massiva-create.component';
import { BulkSearchService } from '../../services/bulk-search.service';
import dayjs from '../../../config/dayjs';

describe('RicercaMassivaCreateComponent', () => {
  let fixture: ComponentFixture<RicercaMassivaCreateComponent>;
  let comp: RicercaMassivaCreateComponent;
  let bulkSearchService: BulkSearchService;
  let router: Router;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [RicercaMassivaCreateComponent],
      providers: [{ provide: Router, useValue: { navigate: jest.fn() } }],
    })
      .overrideTemplate(RicercaMassivaCreateComponent, '')
      .createComponent(RicercaMassivaCreateComponent);

    comp = fixture.componentInstance;
    bulkSearchService = TestBed.inject(BulkSearchService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('is invalid when required fields are missing', () => {
    expect(comp.editForm.invalid).toBe(true);
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
        searchCriteria: expect.objectContaining({ paymentOutcome: 'OK' }),
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

  it('navigates back to the list on cancel', () => {
    comp.previousState();

    expect(router.navigate).toHaveBeenCalledWith(['/bulk/ricerca-massiva']);
  });
});
