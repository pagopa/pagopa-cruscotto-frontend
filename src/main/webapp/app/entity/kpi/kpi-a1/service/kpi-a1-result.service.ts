import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiA1Result } from '../models/KpiA1Result';
import { DATE_TIME_FORMAT_ISO } from 'app/config/input.constants';
import { ApplicationConfigService } from '../../../../core/config/application-config.service';

type KpiA1ResultRestOf<T extends KpiA1Result> = Omit<T, 'analysisDate'> & {
  analysisDate?: string | null;
};

export type RestKpiA1Result = KpiA1ResultRestOf<KpiA1Result>;

type EntityResponseType = HttpResponse<KpiA1Result>;
type EntityArrayResponseType = HttpResponse<KpiA1Result[]>;

@Injectable({
  providedIn: 'root',
})
export class KpiA1ResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-results/a1/module');
  }

  /**
   * Recupera i KPI di tipo A1 associati a un dato modulo.
   *
   * @param moduleId - ID del modulo per cui recuperare i KPI.
   * @returns Observable con l'array dei risultati di tipo KpiA1Result.
   */
  getKpiA1Results(moduleId: number | undefined): Observable<KpiA1Result[]> {
    return this.http
      .get<RestKpiA1Result[]>(`${this.resourceUrl}/${moduleId}`)
      .pipe(map(res => res.map(item => this.convertKpiA1ResultFromServer(item))));
  }

  /**
   * Recupera i risultati KPI A1 per un modulo specifico.
   */
  find(moduleId: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestKpiA1Result[]>(`${this.resourceUrl}/${moduleId}`, { observe: 'response' })
      .pipe(map(res => this.convertKpiA1ResultArrayFromServer(res)));
  }

  /**
   * Crea un nuovo Kpi A1.
   */
  create(kpiA1Result: KpiA1Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiA1Result);
    return this.http
      .post<RestKpiA1Result>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Aggiorna un risultato KPI A1 esistente.
   */
  update(kpiA1Result: KpiA1Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiA1Result);
    return this.http
      .put<RestKpiA1Result>(`${this.resourceUrl}/${kpiA1Result.id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Elimina un risultato KPI A1 dato l'id.
   */
  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  /**
   * Converte una data dal client nel formato richiesto dal server.
   */
  protected convertDateFromClient<T extends KpiA1Result>(kpiA1Result: T): KpiA1ResultRestOf<T> {
    return {
      ...kpiA1Result,
      analysisDate: kpiA1Result.analysisDate?.toISOString() ?? null,
    };
  }

  /**
   * Converte la risposta ricevuta dal server in formato `KpiA1Result`.
   */
  protected convertResponseFromServer(res: HttpResponse<RestKpiA1Result>): HttpResponse<KpiA1Result> {
    return res.clone({
      body: res.body ? this.convertKpiA1ResultFromServer(res.body) : null,
    });
  }

  /**
   * Converte un array di risultati KPI A1 ricevuti dal server.
   */
  protected convertKpiA1ResultArrayFromServer(res: HttpResponse<RestKpiA1Result[]>): HttpResponse<KpiA1Result[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertKpiA1ResultFromServer(item)) : null,
    });
  }

  /**
   * Converte un singolo KpiA1Result dal formato `Rest` ricevuto dal server.
   */
  protected convertKpiA1ResultFromServer(restKpiA1Result: RestKpiA1Result): KpiA1Result {
    return {
      ...restKpiA1Result,
      analysisDate: restKpiA1Result.analysisDate ? dayjs(restKpiA1Result.analysisDate, DATE_TIME_FORMAT_ISO) : null,
    };
  }
}
