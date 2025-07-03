import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB9Result } from '../models/KpiB9Result';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from '../../../../core/config/application-config.service';

type KpiB9ResultRestOf<T extends KpiB9Result> = Omit<T, 'dtAnalisysDate'> & {
  dtAnalisysDate?: string | null;
};

export type RestKpiB9Result = KpiB9ResultRestOf<KpiB9Result>;

type EntityResponseType = HttpResponse<KpiB9Result>;
type EntityArrayResponseType = HttpResponse<KpiB9Result[]>;

@Injectable({
  providedIn: 'root',
})
export class KpiB9ResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-results/b9/module');
  }

  /**
   * Recupera i KPI B9 associati a un dato modulo.
   *
   * @param moduleId - ID del modulo per cui recuperare i KPI.
   * @returns Observable con l'array dei risultati di tipo KpiB9Result.
   */
  getKpiB9Results(moduleId: number | undefined): Observable<KpiB9Result[]> {
    return this.http
      .get<RestKpiB9Result[]>(`${this.resourceUrl}/${moduleId}`)
      .pipe(map(res => res.map(item => this.convertKpiB9ResultFromServer(item))));
  }

  /**
   * Recupera i risultati KPI B9 per un modulo specifico.
   */
  find(moduleId: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestKpiB9Result[]>(`${this.resourceUrl}/${moduleId}`, { observe: 'response' })
      .pipe(map(res => this.convertKpiB9ResultArrayFromServer(res)));
  }

  /**
   * Crea un nuovo KpiB9Result.
   */
  create(kpiB9Result: KpiB9Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiB9Result);
    return this.http
      .post<RestKpiB9Result>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Aggiorna un risultato KPI B9 esistente.
   */
  update(kpiB9Result: KpiB9Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiB9Result);
    return this.http
      .put<RestKpiB9Result>(`${this.resourceUrl}/${kpiB9Result.id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Elimina un risultato KPI B9 dato l'id.
   */
  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  /**
   * Converte una data dal client nel formato richiesto dal server.
   */
  protected convertDateFromClient<T extends KpiB9Result>(kpiB9Result: T): KpiB9ResultRestOf<T> {
    return {
      ...kpiB9Result,
      analysisDate: kpiB9Result.analysisDate?.toISOString() ?? null,
    };
  }

  /**
   * Converte la risposta ricevuta dal server in formato `KpiB9Result`.
   */
  protected convertResponseFromServer(res: HttpResponse<RestKpiB9Result>): HttpResponse<KpiB9Result> {
    return res.clone({
      body: res.body ? this.convertKpiB9ResultFromServer(res.body) : null,
    });
  }

  /**
   * Converte un array di risultati KPI B9 ricevuti dal server.
   */
  protected convertKpiB9ResultArrayFromServer(res: HttpResponse<RestKpiB9Result[]>): HttpResponse<KpiB9Result[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertKpiB9ResultFromServer(item)) : null,
    });
  }

  /**
   * Converte un singolo KpiB9Result dal formato `Rest` ricevuto dal server.
   */
  protected convertKpiB9ResultFromServer(restKpiB9Result: RestKpiB9Result): KpiB9Result {
    return {
      ...restKpiB9Result,
      analysisDate: restKpiB9Result.analysisDate ? dayjs(restKpiB9Result.analysisDate, DATE_FORMAT) : null,
    };
  }
}
