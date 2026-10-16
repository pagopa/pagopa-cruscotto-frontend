import { HttpErrorResponse } from '@angular/common/http';

import { isDuplicateBulkSearchInstanceError, isDuplicateHttpError } from './alert.component';

describe('isDuplicateBulkSearchInstanceError', () => {
  it('identifies a regular bulk search create conflict', () => {
    const error = new HttpErrorResponse({ status: 409, url: 'https://example.test/api/bulk/search-instances' });

    if (!isDuplicateBulkSearchInstanceError(error)) {
      throw new Error('Expected a regular bulk search create conflict');
    }
  });

  it('does not identify a CSV create conflict', () => {
    const error = new HttpErrorResponse({
      status: 409,
      url: 'https://example.test/api/bulk/search-instances/csv?name=Example',
    });

    if (isDuplicateBulkSearchInstanceError(error)) {
      throw new Error('Expected the CSV create conflict to be excluded');
    }
  });

  it('does not identify another 409 response', () => {
    const error = new HttpErrorResponse({ status: 409, url: 'https://example.test/api/other' });

    if (isDuplicateBulkSearchInstanceError(error)) {
      throw new Error('Expected an unrelated 409 response to be excluded');
    }
  });
});

describe('isDuplicateHttpError', () => {
  const recentlyShownErrors = new Map<string, number>();

  beforeEach(() => recentlyShownErrors.clear());

  it('suppresses an identical error shown within five seconds', () => {
    const error = new HttpErrorResponse({ status: 500, url: 'https://example.test/api/bulk/search-instances' });

    if (isDuplicateHttpError(error, recentlyShownErrors, 1000)) {
      throw new Error('Expected the first occurrence to be shown');
    }
    if (!isDuplicateHttpError(error, recentlyShownErrors, 4999)) {
      throw new Error('Expected an identical error within five seconds to be suppressed');
    }
  });

  it('allows the same error again after five seconds', () => {
    const error = new HttpErrorResponse({ status: 500, url: 'https://example.test/api/bulk/search-instances' });

    if (isDuplicateHttpError(error, recentlyShownErrors, 1000)) {
      throw new Error('Expected the first occurrence to be shown');
    }
    if (isDuplicateHttpError(error, recentlyShownErrors, 5000)) {
      throw new Error('Expected an identical error after five seconds to be shown');
    }
  });

  it('does not suppress different errors', () => {
    const firstError = new HttpErrorResponse({ status: 500, url: 'https://example.test/api/one' });
    const secondError = new HttpErrorResponse({ status: 500, url: 'https://example.test/api/two' });

    if (isDuplicateHttpError(firstError, recentlyShownErrors, 1000)) {
      throw new Error('Expected the first error to be shown');
    }
    if (isDuplicateHttpError(secondError, recentlyShownErrors, 1001)) {
      throw new Error('Expected a different error to be shown');
    }
  });
});
