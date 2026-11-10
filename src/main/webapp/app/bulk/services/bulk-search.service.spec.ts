import { provideHttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BulkSearchService } from './bulk-search.service';

describe('BulkSearchService', () => {
  let service: BulkSearchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(BulkSearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('lists search instances with backend pagination', () => {
    const page = { content: [{ id: 'id', name: 'name' }], totalElements: 21 };
    service.list({ page: 1, size: 20, sort: ['createdAt,desc'] }).subscribe(result => expect(result).toEqual(page));

    const request = httpMock.expectOne({ method: 'GET', url: '/api/bulk/search-instances?page=1&size=20&sort=createdAt%2Cdesc' });
    request.flush(page);
  });

  it('normalizes the legacy array response', () => {
    const instances = [{ id: 'id', name: 'name' }];
    service.list().subscribe(result => expect(result).toEqual({ content: instances, totalElements: 1 }));

    const request = httpMock.expectOne({ method: 'GET', url: '/api/bulk/search-instances' });
    request.flush(instances);
  });

  it('uploads CSV as multipart form data', () => {
    const file = new File(['a,b'], 'input.csv', { type: 'text/csv' });
    service.uploadCsv('id', file).subscribe();

    const request = httpMock.expectOne({ method: 'POST', url: '/api/bulk/search-instances/id/csv' });
    expect(request.request.body).toBeInstanceOf(FormData);
    expect((request.request.body as FormData).get('file')).toBe(file);
    request.flush(null);
  });

  it('creates a search instance from CSV with its name as query parameter', () => {
    const file = new File(['a,b'], 'input.csv', { type: 'text/csv' });
    service.createFromCsv('Custom instance', file).subscribe();

    const request = httpMock.expectOne({ method: 'POST', url: '/api/bulk/search-instances/csv?name=Custom%20instance' });
    expect(request.request.body).toBeInstanceOf(FormData);
    expect((request.request.body as FormData).get('file')).toBe(file);
    request.flush({ id: 'id', name: 'Custom instance' });
  });

  it('downloads the last result as a Blob', () => {
    let result: Blob | undefined;
    service.download('id').subscribe(download => (result = download));

    const request = httpMock.expectOne({ method: 'GET', url: '/api/bulk/search-instances/id/download' });
    expect(request.request.responseType).toBe('blob');
    const zip = new Blob(['zip'], { type: 'application/zip' });
    request.flush(zip);
    expect(result).toBe(zip);
  });

  it('downloads the instance CSV', () => {
    let result: Blob | undefined;
    service.downloadCsv('id').subscribe(download => (result = download));

    const request = httpMock.expectOne({ method: 'GET', url: '/api/bulk/search-instances/id/perimeter/download' });
    expect(request.request.responseType).toBe('blob');
    const csv = new Blob(['name,value'], { type: 'text/csv' });
    request.flush(csv);
    expect(result).toBe(csv);
  });

  it('validates an uploaded CSV file', () => {
    let result: unknown;
    const file = new File(['NAV;123'], 'input.csv', { type: 'text/csv' });
    service.validateCsvFile(file).subscribe(response => (result = response));

    const request = httpMock.expectOne({ method: 'POST', url: '/api/bulk/search-instances/csv/validate-file' });
    expect(request.request.body).toBeInstanceOf(FormData);
    expect((request.request.body as FormData).get('file')).toBe(file);
    request.flush({ valid: true, totalRows: 1, validRows: 1, invalidRows: 0, errors: [] });

    expect(result).toEqual({ valid: true, totalRows: 1, validRows: 1, invalidRows: 0, errors: [] });
  });

  it('uses the declared lifecycle action path', () => {
    service.lifecycleAction('id', 'archive').subscribe();

    const request = httpMock.expectOne({ method: 'POST', url: '/api/bulk/search-instances/id/archive' });
    request.flush({});
  });

  it('plans a search instance through the SERT lifecycle endpoint', () => {
    service.lifecycleAction('id', 'plan').subscribe();

    const request = httpMock.expectOne({ method: 'POST', url: '/api/bulk/search-instances/id/plan' });
    request.flush({});
  });

  it('propagates HTTP errors', () => {
    let receivedStatus: number | undefined;
    service.get('missing').subscribe({ error: (error: HttpErrorResponse) => (receivedStatus = error.status) });

    const request = httpMock.expectOne({ method: 'GET', url: '/api/bulk/search-instances/missing' });
    request.flush({ title: 'Not found', status: 404 }, { status: 404, statusText: 'Not Found' });
    expect(receivedStatus).toBe(404);
  });
});
