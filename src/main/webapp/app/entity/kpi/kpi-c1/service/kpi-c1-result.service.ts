import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiC1Result } from '../models/KpiC1Result';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from '../../../../core/config/application-config.service';

type KpiC1ResultRestOf<T extends KpiC1Result> = Omit<T, 'analysisDate'> & {
  analysisDate?: string | null;
};

export type RestKpiC1Result = KpiC1ResultRestOf<KpiC1Result>;

type EntityResponseType = HttpResponse<KpiC1Result>;
type EntityArrayResponseType = HttpResponse<KpiC1Result[]>;

@Injectable({
  providedIn: 'root',
})
export class KpiC1ResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor(http: HttpClient, applicationConfigService: ApplicationConfigService) {
    this.http = http;
    this.applicationConfigService = applicationConfigService;
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-results/c1/module');
  }

  /**
   * Recupera i KPI di tipo C1 associati a un dato modulo.
   *
   * @param moduleId - ID del modulo per cui recuperare i KPI.
   * @returns Observable con l'array dei risultati di tipo KpiC1Result.
   */
  getKpiResults(moduleId: number | undefined): Observable<KpiC1Result[]> {
    return this.http
      .get<RestKpiC1Result[]>(`${this.resourceUrl}/${moduleId}`)
      .pipe(map(res => res.map(item => this.convertKpiC1ResultFromServer(item))));
  }

  /**
   * Recupera i risultati KPI C1 per un modulo specifico.
   */
  find(moduleId: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestKpiC1Result[]>(`${this.resourceUrl}/${moduleId}`, { observe: 'response' })
      .pipe(map(res => this.convertKpiC1ResultArrayFromServer(res)));
  }

  /**
   * Crea un nuovo Kpi C1.
   */
  create(kpiC1Result: KpiC1Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiC1Result);
    return this.http
      .post<RestKpiC1Result>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Aggiorna un risultato KPI C1 esistente.
   */
  update(kpiC1Result: KpiC1Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiC1Result);
    return this.http
      .put<RestKpiC1Result>(`${this.resourceUrl}/${kpiC1Result.id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Elimina un risultato KPI C1 dato l'id.
   */
  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  /**
   * Converte una data dal client nel formato richiesto dal server.
   */
  protected convertDateFromClient<T extends KpiC1Result>(kpiC1Result: T): KpiC1ResultRestOf<T> {
    return {
      ...kpiC1Result,
      analysisDate: kpiC1Result.analysisDate?.toISOString() ?? null,
    };
  }

  /**
   * Converte la risposta ricevuta dal server in formato `KpiC1Result`.
   */
  protected convertResponseFromServer(res: HttpResponse<RestKpiC1Result>): HttpResponse<KpiC1Result> {
    return res.clone({
      body: res.body ? this.convertKpiC1ResultFromServer(res.body) : null,
    });
  }

  /**
   * Converte un array di risultati KPI C1 ricevuti dal server.
   */
  protected convertKpiC1ResultArrayFromServer(res: HttpResponse<RestKpiC1Result[]>): HttpResponse<KpiC1Result[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertKpiC1ResultFromServer(item)) : null,
    });
  }

  /**
   * Converte un singolo KpiC1Result dal formato `Rest`.
   */
  protected convertKpiC1ResultFromServer(restKpiC1Result: RestKpiC1Result): KpiC1Result {
    return {
      ...restKpiC1Result,
      analysisDate: restKpiC1Result.analysisDate ? dayjs(restKpiC1Result.analysisDate, DATE_FORMAT) : null,
    };
  }
}
