import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { KpiA2Result } from '../models/KpiA2Result';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from '../../../../core/config/application-config.service';

type KpiA2ResultRestOf<T extends KpiA2Result> = Omit<T, 'analysisDate'> & {
  analysisDate?: string | null;
};

export type RestKpiA2Result = KpiA2ResultRestOf<KpiA2Result>;

type EntityResponseType = HttpResponse<KpiA2Result>;
type EntityArrayResponseType = HttpResponse<KpiA2Result[]>;

@Injectable({
  providedIn: 'root',
})
export class KpiA2ResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor() {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-results/a2/module');
  }

  /**
   * Recupera i KPI di tipo A2 associati a un dato modulo.
   *
   * @param moduleId - ID del modulo per cui recuperare i KPI.
   * @returns Observable con l'array dei risultati di tipo KpiA2Result.
   */
  getKpiResults(moduleId: number | undefined): Observable<KpiA2Result[]> {
    return this.http
      .get<RestKpiA2Result[]>(`${this.resourceUrl}/${moduleId}`)
      .pipe(map(res => res.map(item => this.convertKpiA2ResultFromServer(item))));
  }

  /**
   * Recupera i risultati KPI A2 per un modulo specifico.
   */
  find(moduleId: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestKpiA2Result[]>(`${this.resourceUrl}/${moduleId}`, { observe: 'response' })
      .pipe(map(res => this.convertKpiA2ResultArrayFromServer(res)));
  }

  /**
   * Crea un nuovo Kpi A2.
   */
  create(kpiA2Result: KpiA2Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiA2Result);
    return this.http
      .post<RestKpiA2Result>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Aggiorna un risultato KPI A2 esistente.
   */
  update(kpiA2Result: KpiA2Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiA2Result);
    return this.http
      .put<RestKpiA2Result>(`${this.resourceUrl}/${kpiA2Result.id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Elimina un risultato KPI A2 dato l'id.
   */
  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  /**
   * Converte una data dal client nel formato richiesto dal server.
   */
  protected convertDateFromClient<T extends KpiA2Result>(kpiA2Result: T): KpiA2ResultRestOf<T> {
    return {
      ...kpiA2Result,
      analysisDate: kpiA2Result.analysisDate?.toISOString() ?? null,
    };
  }

  /**
   * Converte la risposta ricevuta dal server in formato `KpiA2Result`.
   */
  protected convertResponseFromServer(res: HttpResponse<RestKpiA2Result>): HttpResponse<KpiA2Result> {
    return res.clone({
      body: res.body ? this.convertKpiA2ResultFromServer(res.body) : null,
    });
  }

  /**
   * Converte un array di risultati KPI A2 ricevuti dal server.
   */
  protected convertKpiA2ResultArrayFromServer(res: HttpResponse<RestKpiA2Result[]>): HttpResponse<KpiA2Result[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertKpiA2ResultFromServer(item)) : null,
    });
  }

  /**
   * Converte un singolo KpiA2Result dal formato `Rest` ricevuto dal server.
   */
  protected convertKpiA2ResultFromServer(restKpiA2Result: RestKpiA2Result): KpiA2Result {
    return {
      ...restKpiA2Result,
      analysisDate: restKpiA2Result.analysisDate ? dayjs(restKpiA2Result.analysisDate, DATE_FORMAT) : null,
    };
  }
}
