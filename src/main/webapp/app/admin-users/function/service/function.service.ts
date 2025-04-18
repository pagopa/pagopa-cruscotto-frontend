import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { IFunction, NewFunction } from '../function.model';
import { IPermission } from '../../permission/permission.model';

type EntityResponseType = HttpResponse<IFunction>;
type EntityArrayResponseType = HttpResponse<IFunction[]>;

@Injectable({ providedIn: 'root' })
export class FunctionService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/auth-functions');

  create(authFunction: NewFunction): Observable<EntityResponseType> {
    return this.http.post<IFunction>(this.resourceUrl, authFunction, { observe: 'response' });
  }

  update(authFunction: IFunction): Observable<EntityResponseType> {
    return this.http.put<IFunction>(this.resourceUrl, authFunction, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFunction>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findDetail(id: number): Observable<EntityResponseType> {
    return this.http.get<IFunction>(`${this.resourceUrl}/detail/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFunction[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  findAllByGroup(req?: any, idGroup?: number): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFunction[]>(`${this.resourceUrl}/auth-group/${idGroup}`, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findAssociateFunctionsToGroup(groupId: number, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFunction[]>(`${this.resourceUrl}/auth-group/${groupId}`, {
      params: options,
      observe: 'response',
    });
  }

  findFunzioniAssociabiliByGruppo(idGroup?: number, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFunction[]>(`${this.resourceUrl}/auth-group/${idGroup}/associabili`, {
      params: options,
      observe: 'response',
    });
  }

  associaPermesso(permessiDaAssociare: IPermission[], functionId: number): Observable<HttpResponse<void>> {
    return this.http.post<void>(`${this.resourceUrl}/${functionId}/associa-permessi`, permessiDaAssociare, { observe: 'response' });
  }

  dissociaPermesso(functionId: number, permessoId: number): Observable<HttpResponse<void>> {
    return this.http.get<void>(`${this.resourceUrl}/${functionId}/rimuovi-permesso/${permessoId}`, { observe: 'response' });
  }
}
