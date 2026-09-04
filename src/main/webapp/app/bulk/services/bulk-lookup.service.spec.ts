import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BulkLookupService } from './bulk-lookup.service';

describe('BulkLookupService', () => {
  let service: BulkLookupService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(BulkLookupService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('requests paged stations with repeated sort parameters', () => {
    const page = { content: [{ id: 1, codice: 'station' }] };
    service.stations({ page: 2, size: 10, sort: ['codice,asc', 'id,desc'] }).subscribe(result => {
      expect(result).toEqual(page);
    });

    const request = httpMock.expectOne({
      method: 'GET',
      url: '/api/bulk/lookups/stations?page=2&size=10&sort=codice%2Casc&sort=id%2Cdesc',
    });
    request.flush(page);
  });

  it('covers the lookup endpoints with their contract paths', () => {
    service.touchpoints().subscribe();
    service.psp().subscribe();
    service.paymentMethods().subscribe();
    service.intermediaries().subscribe();
    service.intermediariesPsp().subscribe();
    service.creditorInstitutions().subscribe();
    service.channels().subscribe();

    ['touchpoints', 'psp', 'payment-methods', 'intermediaries', 'intermediaries-psp', 'creditor-institutions', 'channels'].forEach(path =>
      httpMock.expectOne({ method: 'GET', url: `/api/bulk/lookups/${path}` }).flush({ content: [] }),
    );
  });
});
