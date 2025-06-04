import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { IModule, NewModule } from '../module.model';

type ModuleRestOf<T extends IModule | NewModule> = T;

export type RestModuleConfiguration = ModuleRestOf<IModule>;
export type RestModule = ModuleRestOf<IModule>;

type EntityResponseType = HttpResponse<IModule>;
type EntityArrayResponseType = HttpResponse<IModule[]>;

@Injectable({ providedIn: 'root' })
export class ModuleService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/modules');

  getWithoutConfiguration(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IModule[]>(`${this.resourceUrl}/no-configuration`, { params: options, observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IModule[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IModule>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  create(module: NewModule): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(module);
    return this.http
      .post<RestModule>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(Module: IModule): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(Module);
    return this.http.put<RestModule>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient<T extends IModule | NewModule>(module: T): ModuleRestOf<T> {
    return {
      ...module,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestModuleConfiguration>): HttpResponse<IModule> {
    return res.clone({
      body: res.body ? this.convertModuleFromServer(res.body) : null,
    });
  }

  protected convertModuleFromServer(module: RestModuleConfiguration): IModule {
    return {
      ...module,
    };
  }
}
