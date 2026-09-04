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

  it('lists search instances', () => {
    const instances = [{ id: 'id', name: 'name' }];
    service.list().subscribe(result => expect(result).toEqual(instances));

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

  it('downloads the last result as a Blob', () => {
    let result: Blob | undefined;
    service.download('id').subscribe(download => (result = download));

    const request = httpMock.expectOne({ method: 'GET', url: '/api/bulk/search-instances/id/download' });
    expect(request.request.responseType).toBe('blob');
    const zip = new Blob(['zip'], { type: 'application/zip' });
    request.flush(zip);
    expect(result).toBe(zip);
  });

  it('uses the declared lifecycle action path', () => {
    service.lifecycleAction('id', 'archive').subscribe();

    const request = httpMock.expectOne({ method: 'POST', url: '/api/bulk/search-instances/id/archive' });
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
