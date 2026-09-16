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

  it('builds a preview excluding the CSV header', async () => {
    const file = new File(['col1,col2\nvalue1,value2\nvalue3,value4\n'], 'import.csv', { type: 'text/csv' });
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [file], configurable: true });

    await comp.onFileSelected(input);

    expect(comp.csvPreview).toBe('value1,value2\nvalue3,value4');
  });
});
