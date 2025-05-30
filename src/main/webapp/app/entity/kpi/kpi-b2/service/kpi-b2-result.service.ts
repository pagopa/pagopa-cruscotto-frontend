import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB2Result } from '../models/KpiB2Result';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from '../../../../core/config/application-config.service';

type KpiB2ResultRestOf<T extends KpiB2Result> = Omit<T, 'analysisDate'> & {
  analysisDate?: string | null;
};

export type RestKpiB2Result = KpiB2ResultRestOf<KpiB2Result>;

type EntityResponseType = HttpResponse<KpiB2Result>;
type EntityArrayResponseType = HttpResponse<KpiB2Result[]>;

@Injectable({
  providedIn: 'root',
})
export class KpiB2ResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor(http: HttpClient, applicationConfigService: ApplicationConfigService) {
    this.http = http;
    this.applicationConfigService = applicationConfigService;
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-results/b2/module');
  }

  /**
   * Recupera i KPI di tipo B2 associati a un dato modulo.
   *
   * @param moduleId - ID del modulo per cui recuperare i KPI.
   * @returns Observable con l'array dei risultati di tipo KpiB2Result.
   */
  getKpiResults(moduleId: number | undefined): Observable<KpiB2Result[]> {
    return this.http
      .get<RestKpiB2Result[]>(`${this.resourceUrl}/${moduleId}`)
      .pipe(map(res => res.map(item => this.convertKpiB2ResultFromServer(item))));
  }

  /**
   * Recupera i risultati KPI B2 per un modulo specifico.
   */
  find(moduleId: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestKpiB2Result[]>(`${this.resourceUrl}/${moduleId}`, { observe: 'response' })
      .pipe(map(res => this.convertKpiB2ResultArrayFromServer(res)));
  }

  /**
   * Crea un nuovo Kpi B2.
   */
  create(kpiB2Result: KpiB2Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiB2Result);
    return this.http
      .post<RestKpiB2Result>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Aggiorna un risultato KPI B2 esistente.
   */
  update(kpiB2Result: KpiB2Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiB2Result);
    return this.http
      .put<RestKpiB2Result>(`${this.resourceUrl}/${kpiB2Result.id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Elimina un risultato KPI B2 dato l'id.
   */
  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  /**
   * Converte una data dal client nel formato richiesto dal server.
   */
  protected convertDateFromClient<T extends KpiB2Result>(kpiB2Result: T): KpiB2ResultRestOf<T> {
    return {
      ...kpiB2Result,
      analysisDate: kpiB2Result.analysisDate?.toISOString() ?? null,
    };
  }

  /**
   * Converte la risposta ricevuta dal server in formato `KpiB2Result`.
   */
  protected convertResponseFromServer(res: HttpResponse<RestKpiB2Result>): HttpResponse<KpiB2Result> {
    return res.clone({
      body: res.body ? this.convertKpiB2ResultFromServer(res.body) : null,
    });
  }

  /**
   * Converte un array di risultati KPI B2 ricevuti dal server.
   */
  protected convertKpiB2ResultArrayFromServer(res: HttpResponse<RestKpiB2Result[]>): HttpResponse<KpiB2Result[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertKpiB2ResultFromServer(item)) : null,
    });
  }

  /**
   * Converte un singolo KpiB2Result dal formato `Rest`.
   */
  protected convertKpiB2ResultFromServer(restKpiB2Result: RestKpiB2Result): KpiB2Result {
    return {
      ...restKpiB2Result,
      analysisDate: restKpiB2Result.analysisDate ? dayjs(restKpiB2Result.analysisDate, DATE_FORMAT) : null,
    };
  }
}
