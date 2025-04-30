import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { IPermission, NewPermission } from '../permission.model';

type EntityResponseType = HttpResponse<IPermission>;
type EntityArrayResponseType = HttpResponse<IPermission[]>;

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/auth-permissions');

  create(authPermission: NewPermission): Observable<EntityResponseType> {
    return this.http.post<IPermission>(this.resourceUrl, authPermission, { observe: 'response' });
  }

  update(authPermission: IPermission): Observable<EntityResponseType> {
    return this.http.put<IPermission>(this.resourceUrl, authPermission, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPermission>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPermission[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  findAllByFunction(req?: any, idFunction?: number): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPermission[]>(`${this.resourceUrl}/auth-function/${idFunction}`, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findAssociatePermissionsToFunction(functionId?: number, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPermission[]>(`${this.resourceUrl}/auth-function/${functionId}`, {
      params: options,
      observe: 'response',
    });
  }

  findPermessiAssociabiliByFunzione(functionId?: number, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPermission[]>(`${this.resourceUrl}/auth-function/${functionId}/associabili`, {
      params: options,
      observe: 'response',
    });
  }
}
