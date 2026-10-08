import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { RicercaMassivaCsvUploadComponent } from './ricerca-massiva-csv-upload.component';
import { BulkSearchService } from '../../services/bulk-search.service';

describe('RicercaMassivaCsvUploadComponent', () => {
  let fixture: ComponentFixture<RicercaMassivaCsvUploadComponent>;
  let comp: RicercaMassivaCsvUploadComponent;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [RicercaMassivaCsvUploadComponent],
      providers: [
        { provide: Router, useValue: { navigate: jest.fn() } },
        {
          provide: BulkSearchService,
          useValue: {
            validateCsvFile: jest.fn(() => of({ valid: true, errors: [] })),
            createFromCsv: jest.fn(),
          },
        },
      ],
    }).createComponent(RicercaMassivaCsvUploadComponent);

    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('builds a preview excluding the CSV header', async () => {
    const file = new File(['col1,col2\nvalue1,value2\nvalue3,value4\n'], 'import.csv', { type: 'text/csv' });
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [file], configurable: true });

    await comp.onFileSelected(input);

    expect(comp.csvPreview).toBe('value1,value2\nvalue3,value4');
  });

  it('shows every validation error from the response', () => {
    const bulkSearchService = TestBed.inject(BulkSearchService) as { validateCsvFile: jest.Mock };
    bulkSearchService.validateCsvFile.mockReturnValue(
      of({
        valid: false,
        detectedTemplate: 'NAV',
        totalRows: 5,
        validRows: 1,
        invalidRows: 4,
        errors: [
          { lineNumber: 2, column: 'NAV', codeMessage: 'CSV_VALUE_MISSING', message: 'Valore obbligatorio' },
          { lineNumber: 3, column: 'IUV', codeMessage: 'CSV_IUV_LENGTH', message: 'Formato non valido' },
          {
            lineNumber: 4,
            column: 'IMPORTO',
            codeMessage: 'CSV_COLUMN_COUNT',
            expected: 1,
            found: 2,
            message: 'Valore numerico non valido',
          },
          { lineNumber: 5, column: null, codeMessage: 'CSV_HEADER_UNKNOWN', message: 'Valore non presente' },
        ],
      }),
    );

    comp.currentCsvBlob = new Blob(['NAV\n123'], { type: 'text/csv' });
    comp.validateCsv();
    fixture.detectChanges();

    const errorItems = fixture.nativeElement.querySelectorAll('.alert-danger li');
    expect(errorItems).toHaveLength(4);
    expect(fixture.nativeElement.textContent).toContain('Valore non presente');
  });

  it('uses validation errors from the HTTP error body when the backend rejects the CSV', () => {
    const bulkSearchService = TestBed.inject(BulkSearchService) as { validateCsvFile: jest.Mock };
    bulkSearchService.validateCsvFile.mockReturnValue(
      throwError(() => ({
        error: {
          valid: false,
          detectedTemplate: 'NAV',
          totalRows: 5,
          validRows: 1,
          invalidRows: 4,
          errors: [{ lineNumber: 2, column: 'IUV', codeMessage: 'CSV_IUV_LENGTH', message: 'Formato non valido' }],
        },
      })),
    );

    comp.currentCsvBlob = new Blob(['NAV\n123'], { type: 'text/csv' });
    comp.validateCsv();
    fixture.detectChanges();

    expect(comp.validationErrors).toEqual([{ lineNumber: 2, column: 'IUV', codeMessage: 'CSV_IUV_LENGTH', message: 'Formato non valido' }]);
    expect(comp.validationSummary).toContain('5 righe totali');
    expect(comp.canSubmit).toBe(false);
  });

  it('marks the name invalid when the CSV create request returns a duplicate conflict', () => {
    const bulkSearchService = TestBed.inject(BulkSearchService) as { createFromCsv: jest.Mock };
    const error = new HttpErrorResponse({
      status: 409,
      url: 'https://example.test/api/bulk/search-instances/csv?name=Existing',
    });
    bulkSearchService.createFromCsv.mockReturnValue(throwError(() => error));
    comp.form.patchValue({ name: 'Existing', selectedReports: [] });
    comp.selectedFileName = 'input.csv';
    comp.validatedCsvBlob = new Blob(['NAV\n123'], { type: 'text/csv' });
    comp.canSubmit = true;

    comp.submit();

    expect(comp.form.get('name')?.errors).toEqual({ duplicateInstanceName: true });
    expect(comp.form.invalid).toBe(true);
    expect(comp.submitError).toBe(false);

    comp.form.get('name')?.setValue('New name');

    expect(comp.form.get('name')?.errors).toBeNull();
    expect(comp.submitError).toBe(false);
  });
});
