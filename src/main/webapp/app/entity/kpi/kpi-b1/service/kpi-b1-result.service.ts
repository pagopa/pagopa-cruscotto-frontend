import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB1Result } from '../models/KpiB1Result';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from '../../../../core/config/application-config.service';

type KpiB1ResultRestOf<T extends KpiB1Result> = Omit<T, 'analysisDate'> & {
  analysisDate?: string | null;
};

export type RestKpiB1Result = KpiB1ResultRestOf<KpiB1Result>;

type EntityResponseType = HttpResponse<KpiB1Result>;
type EntityArrayResponseType = HttpResponse<KpiB1Result[]>;

@Injectable({
  providedIn: 'root',
})
export class KpiB1ResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor(http: HttpClient, applicationConfigService: ApplicationConfigService) {
    this.http = http;
    this.applicationConfigService = applicationConfigService;
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-results/b1/module');
  }

  /**
   * Recupera i KPI di tipo B1 associati a un dato modulo.
   *
   * @param moduleId - ID del modulo per cui recuperare i KPI.
   * @returns Observable con l'array dei risultati di tipo KpiB1Result.
   */
  getKpiResults(moduleId: number | undefined): Observable<KpiB1Result[]> {
    return this.http
      .get<RestKpiB1Result[]>(`${this.resourceUrl}/${moduleId}`)
      .pipe(map(res => res.map(item => this.convertKpiB1ResultFromServer(item))));
  }

  /**
   * Recupera i risultati KPI B2 per un modulo specifico.
   */
  find(moduleId: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestKpiB1Result[]>(`${this.resourceUrl}/${moduleId}`, { observe: 'response' })
      .pipe(map(res => this.convertKpiB1ResultArrayFromServer(res)));
  }

  /**
   * Crea un nuovo Kpi B2.
   */
  create(KpiB1Result: KpiB1Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(KpiB1Result);
    return this.http
      .post<RestKpiB1Result>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Aggiorna un risultato KPI B2 esistente.
   */
  update(KpiB1Result: KpiB1Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(KpiB1Result);
    return this.http
      .put<RestKpiB1Result>(`${this.resourceUrl}/${KpiB1Result.id}`, copy, { observe: 'response' })
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
  protected convertDateFromClient<T extends KpiB1Result>(KpiB1Result: T): KpiB1ResultRestOf<T> {
    return {
      ...KpiB1Result,
      analysisDate: KpiB1Result.analysisDate?.toISOString() ?? null,
    };
  }

  /**
   * Converte la risposta ricevuta dal server in formato `KpiB1Result`.
   */
  protected convertResponseFromServer(res: HttpResponse<RestKpiB1Result>): HttpResponse<KpiB1Result> {
    return res.clone({
      body: res.body ? this.convertKpiB1ResultFromServer(res.body) : null,
    });
  }

  /**
   * Converte un array di risultati KPI B2 ricevuti dal server.
   */
  protected convertKpiB1ResultArrayFromServer(res: HttpResponse<RestKpiB1Result[]>): HttpResponse<KpiB1Result[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertKpiB1ResultFromServer(item)) : null,
    });
  }

  /**
   * Converte un singolo KpiB1Result dal formato `Rest`.
   */
  protected convertKpiB1ResultFromServer(restKpiB1Result: RestKpiB1Result): KpiB1Result {
    return {
      ...restKpiB1Result,
      analysisDate: restKpiB1Result.analysisDate ? dayjs(restKpiB1Result.analysisDate, DATE_FORMAT) : null,
    };
  }
}
