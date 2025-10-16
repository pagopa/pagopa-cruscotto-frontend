import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiB4Result } from '../models/KpiB4Result';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from '../../../../core/config/application-config.service';

type KpiB4ResultRestOf<T extends KpiB4Result> = Omit<T, 'analysisDate'> & {
  analysisDate?: string | null;
};

export type RestKpiB4Result = KpiB4ResultRestOf<KpiB4Result>;

type EntityResponseType = HttpResponse<KpiB4Result>;
type EntityArrayResponseType = HttpResponse<KpiB4Result[]>;

@Injectable({
  providedIn: 'root',
})
export class KpiB4ResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor(http: HttpClient, applicationConfigService: ApplicationConfigService) {
    this.http = http;
    this.applicationConfigService = applicationConfigService;
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-results/b4/module');
  }

  /**
   * Recupera i KPI di tipo B4 associati a un dato modulo.
   *
   * @param moduleId - ID del modulo per cui recuperare i KPI.
   * @returns Observable con l'array dei risultati di tipo KpiB4Result.
   */
  getKpiResults(moduleId: number | undefined): Observable<KpiB4Result[]> {
    return this.http
      .get<RestKpiB4Result[]>(`${this.resourceUrl}/${moduleId}`)
      .pipe(map(res => res.map(item => this.convertKpiB4ResultFromServer(item))));
  }

  /**
   * Recupera i risultati KPI B4 per un modulo specifico.
   */
  find(moduleId: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestKpiB4Result[]>(`${this.resourceUrl}/${moduleId}`, { observe: 'response' })
      .pipe(map(res => this.convertKpiB4ResultArrayFromServer(res)));
  }

  /**
   * Crea un nuovo Kpi B4.
   */
  create(kpiB4Result: KpiB4Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiB4Result);
    return this.http
      .post<RestKpiB4Result>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Aggiorna un risultato KPI B4 esistente.
   */
  update(kpiB4Result: KpiB4Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiB4Result);
    return this.http
      .put<RestKpiB4Result>(`${this.resourceUrl}/${kpiB4Result.id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Elimina un risultato KPI B4 dato l'id.
   */
  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  /**
   * Converte una data dal client nel formato richiesto dal server.
   */
  protected convertDateFromClient<T extends KpiB4Result>(kpiB4Result: T): KpiB4ResultRestOf<T> {
    return {
      ...kpiB4Result,
      analysisDate: kpiB4Result.analysisDate?.toISOString() ?? null,
    };
  }

  /**
   * Converte la risposta ricevuta dal server in formato `KpiB4Result`.
   */
  protected convertResponseFromServer(res: HttpResponse<RestKpiB4Result>): HttpResponse<KpiB4Result> {
    return res.clone({
      body: res.body ? this.convertKpiB4ResultFromServer(res.body) : null,
    });
  }

  /**
   * Converte un array di risultati KPI B4 ricevuti dal server.
   */
  protected convertKpiB4ResultArrayFromServer(res: HttpResponse<RestKpiB4Result[]>): HttpResponse<KpiB4Result[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertKpiB4ResultFromServer(item)) : null,
    });
  }

  /**
   * Converte un singolo KpiB4Result dal formato `Rest`.
   */
  protected convertKpiB4ResultFromServer(restKpiB4Result: RestKpiB4Result): KpiB4Result {
    return {
      ...restKpiB4Result,
      analysisDate: restKpiB4Result.analysisDate ? dayjs(restKpiB4Result.analysisDate, DATE_FORMAT) : null,
    };
  }
}
