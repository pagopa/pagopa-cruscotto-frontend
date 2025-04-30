import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { IGroup, NewGroup } from '../group.model';
import { IFunction } from '../../function/function.model';

type EntityResponseType = HttpResponse<IGroup>;
type EntityArrayResponseType = HttpResponse<IGroup[]>;

@Injectable({ providedIn: 'root' })
export class GroupService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/auth-groups');

  create(authGroup: NewGroup): Observable<EntityResponseType> {
    return this.http.post<IGroup>(this.resourceUrl, authGroup, { observe: 'response' });
  }

  update(authGroup: IGroup): Observable<EntityResponseType> {
    return this.http.put<IGroup>(this.resourceUrl, authGroup, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGroup>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findDetail(id: number): Observable<EntityResponseType> {
    return this.http.get<IGroup>(`${this.resourceUrl}/detail/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGroup[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  associaFunzioni(funzioniDaAssociare: IFunction[], groupId?: number): Observable<HttpResponse<void>> {
    return this.http.post<void>(`${this.resourceUrl}/${groupId}/associa-funzioni`, funzioniDaAssociare, { observe: 'response' });
  }

  dissociaFunzione(groupId: number, funzioneId: number): Observable<HttpResponse<void>> {
    return this.http.get<void>(`${this.resourceUrl}/${groupId}/rimuovi-funzione/${funzioneId}`, { observe: 'response' });
  }

  aggiornaLivelloVisibilita(authGroups: IGroup[]): Observable<HttpResponse<void>> {
    return this.http.put<void>(`${this.resourceUrl}/aggiorna-livello-visibilita`, authGroups, { observe: 'response' });
  }
}
