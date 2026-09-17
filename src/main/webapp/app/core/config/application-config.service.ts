import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApplicationConfigService {
  private readonly apiUrlKey = 'jhi-serverApiUrl';
  private endpointPrefix = '';

  setEndpointPrefix(endpointPrefix: string): void {
    this.endpointPrefix = endpointPrefix.replace(/\/+$/, '');
    localStorage.setItem(this.apiUrlKey, this.endpointPrefix);
  }

  getEndpointFor(api: string, microservice?: string): string {
    const normalizedApi = api.replace(/^\/+/, '');
    if (microservice) {
      return this.endpointPrefix
        ? `${this.endpointPrefix}/services/${microservice}/${normalizedApi}`
        : `/services/${microservice}/${normalizedApi}`;
    }
    return this.endpointPrefix ? `${this.endpointPrefix}/${normalizedApi}` : `/${normalizedApi}`;
  }

  getSertEndpointFor(api: string): string {
    const normalizedApi = api.replace(/^\/+/, '');
    const sertPrefix = this.endpointPrefix.replace(/\/cruscotto\/v1\/?$/, '/cruscotto-sert/v1');
    return sertPrefix ? `${sertPrefix}/${normalizedApi}` : `/${normalizedApi}`;
  }
}
