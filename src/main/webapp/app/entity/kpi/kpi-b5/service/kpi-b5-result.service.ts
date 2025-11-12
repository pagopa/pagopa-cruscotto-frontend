import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB5Result } from '../models/KpiB5Result';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from '../../../../core/config/application-config.service';

type KpiB5ResultRestOf<T extends KpiB5Result> = Omit<T, 'dtAnalisysDate'> & {
  analysisDate?: string | null;
};

export type RestKpiB5Result = KpiB5ResultRestOf<KpiB5Result>;

type EntityResponseType = HttpResponse<KpiB5Result>;
type EntityArrayResponseType = HttpResponse<KpiB5Result[]>;

@Injectable({
  providedIn: 'root',
})
export class KpiB5ResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-results/b5/module');
  }

  /**
   * Recupera i KPI B5 associati a un dato modulo.
   *
   * @param moduleId - ID del modulo per cui recuperare i KPI.
   * @returns Observable con l'array dei risultati di tipo KpiB5Result.
   */
  getKpiB5Results(moduleId: number | undefined): Observable<KpiB5Result[]> {
    return this.http
      .get<RestKpiB5Result[]>(`${this.resourceUrl}/${moduleId}`)
      .pipe(map(res => res.map(item => this.convertKpiB5ResultFromServer(item))));
  }

  /**
   * Recupera i risultati KPI B5 per un modulo specifico.
   */
  find(moduleId: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestKpiB5Result[]>(`${this.resourceUrl}/${moduleId}`, { observe: 'response' })
      .pipe(map(res => this.convertKpiB5ResultArrayFromServer(res)));
  }

  /**
   * Crea un nuovo KpiB5Result.
   */
  create(kpiB5Result: KpiB5Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiB5Result);
    return this.http
      .post<RestKpiB5Result>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Aggiorna un risultato KPI B5 esistente.
   */
  update(kpiB5Result: KpiB5Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiB5Result);
    return this.http
      .put<RestKpiB5Result>(`${this.resourceUrl}/${kpiB5Result.id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Elimina un risultato KPI B5 dato l'id.
   */
  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  /**
   * Converte una data dal client nel formato richiesto dal server.
   */
  protected convertDateFromClient<T extends KpiB5Result>(kpiB5Result: T): KpiB5ResultRestOf<T> {
    return {
      ...kpiB5Result,
      analysisDate: kpiB5Result.analysisDate?.toISOString() ?? null,
    };
  }

  /**
   * Converte la risposta ricevuta dal server in formato `KpiB5Result`.
   */
  protected convertResponseFromServer(res: HttpResponse<RestKpiB5Result>): HttpResponse<KpiB5Result> {
    return res.clone({
      body: res.body ? this.convertKpiB5ResultFromServer(res.body) : null,
    });
  }

  /**
   * Converte un array di risultati KPI B5 ricevuti dal server.
   */
  protected convertKpiB5ResultArrayFromServer(res: HttpResponse<RestKpiB5Result[]>): HttpResponse<KpiB5Result[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertKpiB5ResultFromServer(item)) : null,
    });
  }

  /**
   * Converte un singolo KpiB5Result dal formato `Rest` ricevuto dal server.
   */
  protected convertKpiB5ResultFromServer(restKpiB5Result: RestKpiB5Result): KpiB5Result {
    return {
      ...restKpiB5Result,
      analysisDate: restKpiB5Result.analysisDate ? dayjs(restKpiB5Result.analysisDate, DATE_FORMAT) : null,
    };
  }
}
