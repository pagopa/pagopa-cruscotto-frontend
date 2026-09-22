import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

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
        { provide: BulkSearchService, useValue: { validateCsvFile: jest.fn(() => of({ valid: true, errors: [] })) } },
      ],
    }).createComponent(RicercaMassivaCsvUploadComponent);

    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('keeps the CSV guide collapsed by default and exposes format descriptions', () => {
    expect(comp.isGuideOpen).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('Mostra guida');
    expect(fixture.nativeElement.textContent).toContain('Ricerca tramite NAV e Dominio');
  });

  it('builds a preview excluding the CSV header', async () => {
    const file = new File(['col1,col2\nvalue1,value2\nvalue3,value4\n'], 'import.csv', { type: 'text/csv' });
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [file], configurable: true });

    await comp.onFileSelected(input);

    expect(comp.csvPreview).toBe('value1,value2\nvalue3,value4');
  });

  it('shows only the first validation errors and the remaining count', () => {
    const bulkSearchService = TestBed.inject(BulkSearchService) as { validateCsvFile: jest.Mock };
    bulkSearchService.validateCsvFile.mockReturnValue(
      of({
        valid: false,
        detectedTemplate: 'NAV',
        totalRows: 5,
        validRows: 1,
        invalidRows: 4,
        errors: [
          { lineNumber: 2, column: 'NAV', message: 'Valore obbligatorio' },
          { lineNumber: 3, column: 'IUV', message: 'Formato non valido' },
          { lineNumber: 4, column: 'IMPORTO', message: 'Valore numerico non valido' },
          { lineNumber: 5, column: 'DOMINIO', message: 'Valore non presente' },
        ],
      }),
    );

    comp.currentCsvBlob = new Blob(['NAV\n123'], { type: 'text/csv' });
    comp.validateCsv();
    fixture.detectChanges();

    expect(comp.visibleValidationErrors).toHaveLength(3);
    expect(comp.remainingErrorsCount).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('altri 1 errore');
  });
});
