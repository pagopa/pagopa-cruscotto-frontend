import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { IUser } from '../user-management.model';
import { DATE_TIME_FORMAT } from '../../../config/input.constants';
import dayjs from 'dayjs/esm';

type UserRestOf<T extends IUser> = Omit<T, 'createdDate' | 'lastModifiedDate' | 'deletedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  deletedDate?: string | null;
};

export type RestUser = UserRestOf<IUser>;

type EntityResponseType = HttpResponse<IUser>;

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/auth-users');

  create(user: IUser): Observable<EntityResponseType> {
    return this.http.post<IUser>(this.resourceUrl, user, { observe: 'response' });
  }

  update(user: IUser): Observable<EntityResponseType> {
    return this.http.put<IUser>(this.resourceUrl, user, { observe: 'response' });
  }

  changeState(id: number): Observable<IUser> {
    return this.http.put<IUser>(`${this.resourceUrl}/changeState/${id}`, {});
  }

  find(login: string): Observable<IUser> {
    return this.http.get<RestUser>(`${this.resourceUrl}/${login}`).pipe(map(res => this.convertUserFromServer(res)));
  }

  query(req?: Pagination): Observable<HttpResponse<IUser[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestUser[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertUserResponseArrayFromServer(res)));
  }

  delete(login: string): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${login}`);
  }

  resetPasswordByLogin(login: string): Observable<any> {
    return this.http.post(`${this.resourceUrl}/reset`, login);
  }

  findById(id: number): Observable<IUser> {
    return this.http.get<RestUser>(`${this.resourceUrl}/${id}/view`).pipe(map(res => this.convertUserFromServer(res)));
  }

  protected convertUserResponseArrayFromServer(res: HttpResponse<RestUser[]>): HttpResponse<IUser[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertUserFromServer(item)) : null,
    });
  }

  protected convertUserFromServer(restUser: RestUser): IUser {
    return {
      ...restUser,
      createdDate: restUser.createdDate ? dayjs(restUser.createdDate, DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: restUser.lastModifiedDate ? dayjs(restUser.lastModifiedDate, DATE_TIME_FORMAT) : undefined,
      deletedDate: restUser.deletedDate ? dayjs(restUser.deletedDate, DATE_TIME_FORMAT) : undefined,
    };
  }
}
