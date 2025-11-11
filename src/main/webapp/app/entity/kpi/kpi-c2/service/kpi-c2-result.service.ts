import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from '../../../../core/config/application-config.service';
import { KpiC2Result } from '../models/kpi-c2-models';

type KpiC2ResultRestOf<T extends KpiC2Result> = Omit<T, 'analysisDate'> & {
  analysisDate?: string | null;
};

export type RestKpiC2Result = KpiC2ResultRestOf<KpiC2Result>;

type EntityResponseType = HttpResponse<KpiC2Result>;
type EntityArrayResponseType = HttpResponse<KpiC2Result[]>;

@Injectable({
  providedIn: 'root',
})
export class KpiC2ResultService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string;

  constructor(http: HttpClient, applicationConfigService: ApplicationConfigService) {
    this.http = http;
    this.applicationConfigService = applicationConfigService;
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-C2/results');
  }

  /**
   * Recupera i KPI di tipo C2 associati a un dato modulo.
   *
   * @param moduleId - ID del modulo per cui recuperare i KPI.
   * @returns Observable con l'array dei risultati di tipo KpiC2Result.
   */
  getKpiResults(moduleId: number | undefined): Observable<KpiC2Result[]> {
    return this.http
      .get<RestKpiC2Result[]>(`${this.resourceUrl}/${moduleId}`)
      .pipe(map(res => res.map(item => this.convertKpiC2ResultFromServer(item))));
  }

  /**
   * Recupera i risultati KPI C2 per un modulo specifico.
   */
  find(moduleId: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestKpiC2Result[]>(`${this.resourceUrl}/${moduleId}`, { observe: 'response' })
      .pipe(map(res => this.convertKpiC2ResultArrayFromServer(res)));
  }

  /**
   * Crea un nuovo Kpi C2.
   */
  create(kpiC2Result: KpiC2Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiC2Result);
    return this.http
      .post<RestKpiC2Result>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Aggiorna un risultato KPI C2 esistente.
   */
  update(kpiC2Result: KpiC2Result): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiC2Result);
    return this.http
      .put<RestKpiC2Result>(`${this.resourceUrl}/${kpiC2Result.id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Elimina un risultato KPI C2 dato l'id.
   */
  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  /**
   * Converte una data dal client nel formato richiesto dal server.
   */
  protected convertDateFromClient<T extends KpiC2Result>(kpiC2Result: T): KpiC2ResultRestOf<T> {
    return {
      ...kpiC2Result,
      analysisDate: kpiC2Result.analysisDate?.toISOString() ?? null,
    };
  }

  /**
   * Converte la risposta ricevuta dal server in formato `KpiC2Result`.
   */
  protected convertResponseFromServer(res: HttpResponse<RestKpiC2Result>): HttpResponse<KpiC2Result> {
    return res.clone({
      body: res.body ? this.convertKpiC2ResultFromServer(res.body) : null,
    });
  }

  /**
   * Converte un array di risultati KPI C2 ricevuti dal server.
   */
  protected convertKpiC2ResultArrayFromServer(res: HttpResponse<RestKpiC2Result[]>): HttpResponse<KpiC2Result[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertKpiC2ResultFromServer(item)) : null,
    });
  }

  /**
   * Converte un singolo KpiC2Result dal formato `Rest`.
   */
  protected convertKpiC2ResultFromServer(restKpiC2Result: RestKpiC2Result): KpiC2Result {
    return {
      ...restKpiC2Result,
      analysisDate: restKpiC2Result.analysisDate ? dayjs(restKpiC2Result.analysisDate, DATE_FORMAT) : null,
    };
  }
}
