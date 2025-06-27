import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApplicationConfigService {
  private readonly apiUrlKey = 'jhi-serverApiUrl';
  private endpointPrefix = '';

  setEndpointPrefix(endpointPrefix: string): void {
    this.endpointPrefix = endpointPrefix;
    localStorage.setItem(this.apiUrlKey, endpointPrefix);
  }

  getEndpointFor(api: string, microservice?: string): string {
    if (microservice) {
      return `${this.endpointPrefix}services/${microservice}/${api}`;
    }
    return `${this.endpointPrefix}${api}`;
  }
}
