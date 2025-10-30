import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB8Result } from '../models/KpiB8Result';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from '../../../../core/config/application-config.service';

type KpiB8ResultRestOf<T extends KpiB8Result> = Omit<T, 'analysisDate'> & {
  analysisDate?: string | null;
};

export type RestKpiB8Result = KpiB8ResultRestOf<KpiB8Result>;

type EntityResponseType = HttpResponse<KpiB8Result>;
type EntityArrayResponseType = HttpResponse<KpiB8Result[]>;

@Injectable({
  providedIn: 'root',
})
export class KpiB8ResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor(http: HttpClient, applicationConfigService: ApplicationConfigService) {
    this.http = http;
    this.applicationConfigService = applicationConfigService;
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-results/b8/module');
  }

  /**
   * Recupera i KPI di tipo B8 associati a un dato modulo.
   *
   * @param moduleId - ID del modulo per cui recuperare i KPI.
   * @returns Observable con l'array dei risultati di tipo KpiB8Result.
   */
  getKpiResults(moduleId: number | undefined): Observable<KpiB8Result[]> {
    return this.http
      .get<RestKpiB8Result[]>(`${this.resourceUrl}/${moduleId}`)
      .pipe(map(res => res.map(item => this.convertKpiB8ResultFromServer(item))));
  }

  /**
   * Recupera i risultati KPI B8 per un modulo specifico.
   */
  find(moduleId: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestKpiB8Result[]>(`${this.resourceUrl}/${moduleId}`, { observe: 'response' })
      .pipe(map(res => this.convertKpiB8ResultArrayFromServer(res)));
  }

  /**
   * Crea un nuovo Kpi B8.
   */
  create(kpiB8Result: KpiB8Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiB8Result);
    return this.http
      .post<RestKpiB8Result>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Aggiorna un risultato KPI B8 esistente.
   */
  update(kpiB8Result: KpiB8Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiB8Result);
    return this.http
      .put<RestKpiB8Result>(`${this.resourceUrl}/${kpiB8Result.id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Elimina un risultato KPI B8 dato l'id.
   */
  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  /**
   * Converte una data dal client nel formato richiesto dal server.
   */
  protected convertDateFromClient<T extends KpiB8Result>(kpiB8Result: T): KpiB8ResultRestOf<T> {
    return {
      ...kpiB8Result,
      analysisDate: kpiB8Result.analysisDate?.toISOString() ?? null,
    };
  }

  /**
   * Converte la risposta ricevuta dal server in formato `KpiB8Result`.
   */
  protected convertResponseFromServer(res: HttpResponse<RestKpiB8Result>): HttpResponse<KpiB8Result> {
    return res.clone({
      body: res.body ? this.convertKpiB8ResultFromServer(res.body) : null,
    });
  }

  /**
   * Converte un array di risultati KPI B8 ricevuti dal server.
   */
  protected convertKpiB8ResultArrayFromServer(res: HttpResponse<RestKpiB8Result[]>): HttpResponse<KpiB8Result[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertKpiB8ResultFromServer(item)) : null,
    });
  }

  /**
   * Converte un singolo KpiB8Result dal formato `Rest`.
   */
  protected convertKpiB8ResultFromServer(restKpiB8Result: RestKpiB8Result): KpiB8Result {
    return {
      ...restKpiB8Result,
      analysisDate: restKpiB8Result.analysisDate ? dayjs(restKpiB8Result.analysisDate, DATE_FORMAT) : null,
    };
  }
}