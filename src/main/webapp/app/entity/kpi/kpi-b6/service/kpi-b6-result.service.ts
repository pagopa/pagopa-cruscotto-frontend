import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB6Result } from '../models/KpiB6Result';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from '../../../../core/config/application-config.service';

type KpiB6ResultRestOf<T extends KpiB6Result> = Omit<T, 'analysisDate'> & {
  analysisDate?: string | null;
};

export type RestKpiB6Result = KpiB6ResultRestOf<KpiB6Result>;

type EntityResponseType = HttpResponse<KpiB6Result>;
type EntityArrayResponseType = HttpResponse<KpiB6Result[]>;

@Injectable({
  providedIn: 'root',
})
export class KpiB6ResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor(http: HttpClient, applicationConfigService: ApplicationConfigService) {
    this.http = http;
    this.applicationConfigService = applicationConfigService;
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-results/b6/module');
  }

  /**
   * Recupera i KPI di tipo B6 associati a un dato modulo.
   *
   * @param moduleId - ID del modulo per cui recuperare i KPI.
   * @returns Observable con l'array dei risultati di tipo KpiB6Result.
   */
  getKpiResults(moduleId: number | undefined): Observable<KpiB6Result[]> {
    return this.http
      .get<RestKpiB6Result[]>(`${this.resourceUrl}/${moduleId}`)
      .pipe(map(res => res.map(item => this.convertKpiB6ResultFromServer(item))));
  }

  /**
   * Recupera i risultati KPI B6 per un modulo specifico.
   */
  find(moduleId: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestKpiB6Result[]>(`${this.resourceUrl}/${moduleId}`, { observe: 'response' })
      .pipe(map(res => this.convertKpiB6ResultArrayFromServer(res)));
  }

  /**
   * Crea un nuovo Kpi B6.
   */
  create(kpiB6Result: KpiB6Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiB6Result);
    return this.http
      .post<RestKpiB6Result>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Aggiorna un risultato KPI B6 esistente.
   */
  update(kpiB6Result: KpiB6Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiB6Result);
    return this.http
      .put<RestKpiB6Result>(`${this.resourceUrl}/${kpiB6Result.id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Elimina un risultato KPI B6 dato l'id.
   */
  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  /**
   * Converte una data dal client nel formato richiesto dal server.
   */
  protected convertDateFromClient<T extends KpiB6Result>(kpiB6Result: T): KpiB6ResultRestOf<T> {
    return {
      ...kpiB6Result,
      analysisDate: kpiB6Result.analysisDate?.toISOString() ?? null,
    };
  }

  /**
   * Converte la risposta ricevuta dal server in formato `KpiB6Result`.
   */
  protected convertResponseFromServer(res: HttpResponse<RestKpiB6Result>): HttpResponse<KpiB6Result> {
    return res.clone({
      body: res.body ? this.convertKpiB6ResultFromServer(res.body) : null,
    });
  }

  /**
   * Converte un array di risultati KPI B6 ricevuti dal server.
   */
  protected convertKpiB6ResultArrayFromServer(res: HttpResponse<RestKpiB6Result[]>): HttpResponse<KpiB6Result[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertKpiB6ResultFromServer(item)) : null,
    });
  }

  /**
   * Converte un singolo KpiB6Result dal formato `Rest`.
   */
  protected convertKpiB6ResultFromServer(restKpiB6Result: RestKpiB6Result): KpiB6Result {
    return {
      ...restKpiB6Result,
      analysisDate: restKpiB6Result.analysisDate ? dayjs(restKpiB6Result.analysisDate, DATE_FORMAT) : null,
    };
  }
}
