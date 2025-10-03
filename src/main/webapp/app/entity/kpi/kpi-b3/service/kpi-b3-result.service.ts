import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB3Result } from '../models/KpiB3Result';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from '../../../../core/config/application-config.service';

type KpiB3ResultRestOf<T extends KpiB3Result> = Omit<T, 'analysisDate'> & {
  analysisDate?: string | null;
};
export type RestKpiB3Result = KpiB3ResultRestOf<KpiB3Result>;

type EntityResponseType = HttpResponse<KpiB3Result>;
type EntityArrayResponseType = HttpResponse<KpiB3Result[]>;

@Injectable({
  providedIn: 'root',
})
export class KpiB3ResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor(http: HttpClient, applicationConfigService: ApplicationConfigService) {
    this.http = http;
    this.applicationConfigService = applicationConfigService;
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-results/b3/module');
  }

  /**
   * Recupera i KPI di tipo B3 associati a un dato modulo.
   *
   * @param moduleId - ID del modulo per cui recuperare i KPI.
   * @returns Observable con l'array dei risultati di tipo KpiB3Result.
   */
  getKpiResults(moduleId: number | undefined): Observable<KpiB3Result[]> {
    return this.http
      .get<RestKpiB3Result[]>(`${this.resourceUrl}/${moduleId}`)
      .pipe(map(res => res.map(item => this.convertKpiB3ResultFromServer(item))));
  }

  /**
   * Recupera i risultati KPI B3 per un modulo specifico.
   */
  find(moduleId: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestKpiB3Result[]>(`${this.resourceUrl}/${moduleId}`, { observe: 'response' })
      .pipe(map(res => this.convertKpiB3ResultArrayFromServer(res)));
  }

  /**
   * Crea un nuovo Kpi B3.
   */
  create(kpiB3Result: KpiB3Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiB3Result);
    return this.http
      .post<RestKpiB3Result>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Aggiorna un risultato KPI B3 esistente.
   */
  update(kpiB3Result: KpiB3Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiB3Result);
    return this.http
      .put<RestKpiB3Result>(`${this.resourceUrl}/${kpiB3Result.id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Elimina un risultato KPI B3 dato l'id.
   */
  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  /**
   * Converte una data dal client nel formato richiesto dal server.
   */
  protected convertDateFromClient<T extends KpiB3Result>(kpiB3Result: T): KpiB3ResultRestOf<T> {
    return {
      ...kpiB3Result,
      analysisDate: kpiB3Result.analysisDate?.toISOString() ?? null,
    };
  }

  /**
   * Converte la risposta ricevuta dal server in formato `KpiB3Result`.
   */
  protected convertResponseFromServer(res: HttpResponse<RestKpiB3Result>): HttpResponse<KpiB3Result> {
    return res.clone({
      body: res.body ? this.convertKpiB3ResultFromServer(res.body) : null,
    });
  }

  /**
   * Converte un array di risultati KPI B3 ricevuti dal server.
   */
  protected convertKpiB3ResultArrayFromServer(res: HttpResponse<RestKpiB3Result[]>): HttpResponse<KpiB3Result[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertKpiB3ResultFromServer(item)) : null,
    });
  }

  /**
   * Converte un singolo KpiB3Result dal formato `Rest`.
   */
  protected convertKpiB3ResultFromServer(restKpiB3Result: RestKpiB3Result): KpiB3Result {
    return {
      ...restKpiB3Result,
      analysisDate: restKpiB3Result.analysisDate ? dayjs(restKpiB3Result.analysisDate, DATE_FORMAT) : null,
    };
  }
}
