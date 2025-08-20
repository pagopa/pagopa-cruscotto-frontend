import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { IInstanceModule } from '../models/instance-module.model';
import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { DATE_TIME_FORMAT_ISO } from 'app/config/input.constants';
import { createRequestOption } from '../../../core/request/request-util';
import { ModuleStatus } from '../models/module-status.model';
import { AnalysisOutcome } from '../models/analysis-outcome.model';
import { Dayjs } from 'dayjs';

type InstanceModuleRestOf<T extends IInstanceModule> = Omit<T, 'automaticOutcomeDate' | 'manualOutcomeDate'> & {
  automaticOutcomeDate?: string | null;
  manualOutcomeDate?: string | null;
};

export type RestInstanceModule = InstanceModuleRestOf<IInstanceModule>;

type EntityResponseType = HttpResponse<IInstanceModule>;
type EntityArrayResponseType = HttpResponse<IInstanceModule[]>;

@Injectable({
  providedIn: 'root',
})
export class InstanceModuleService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl: string; // Endpoint del backend per il modulo

  constructor(http: HttpClient, applicationConfigService: ApplicationConfigService) {
    this.http = http;
    this.applicationConfigService = applicationConfigService;
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/instance-modules');
  }

  /**
   * Ottiene i dettagli di un modulo specifico legato a un'istanza.
   */
  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestInstanceModule>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Aggiorna i dati di un modulo.
   */
  update(instanceModule: IInstanceModule): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(instanceModule);
    return this.http
      .put<RestInstanceModule>(`${this.resourceUrl}/${instanceModule.id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Aggiorna i dati di un modulo, usato per cambiare status e risultato manuale.
   */
  patch(instanceModule: IInstanceModule): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(instanceModule);
    return this.http.patch<RestInstanceModule>(`${this.resourceUrl}`, copy, { observe: 'response' }).pipe(
      first(),
      map(res => this.convertResponseFromServer(res)),
    );
  }

  /**
   * Ottiene l'elenco di tutti i moduli. Supporta parametri di query.
   */
  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestInstanceModule[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertInstanceModuleArrayFromServer(res)));
  }

  /**
   * Cancella un modulo dato l'id.
   */
  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  /**
   * Converte le date dal client nel formato richiesto dal server.
   */
  protected convertDateFromClient<T extends IInstanceModule>(instanceModule: T): InstanceModuleRestOf<T> {
    return {
      ...instanceModule,
      automaticOutcomeDate: instanceModule.automaticOutcomeDate?.toISOString() ?? null,
      manualOutcomeDate: instanceModule.manualOutcomeDate?.toISOString() ?? null,
    };
  }

  /**
   * Converte la risposta ricevuta dal server in formato `IInstanceModule`.
   */
  protected convertResponseFromServer(res: HttpResponse<RestInstanceModule>): HttpResponse<IInstanceModule> {
    return res.clone({
      body: res.body ? this.convertInstanceModuleFromServer(res.body) : null,
    });
  }

  /**
   * Converte un array di moduli restituito dal backend.
   */
  protected convertInstanceModuleArrayFromServer(res: HttpResponse<RestInstanceModule[]>): HttpResponse<IInstanceModule[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertInstanceModuleFromServer(item)) : null,
    });
  }

  /**
   * Converte un singolo modulo dal formato `Rest` del server al formato `IInstanceModule` del client.
   */
  protected convertInstanceModuleFromServer(restInstanceModule: RestInstanceModule): IInstanceModule {
    return {
      ...restInstanceModule,
      automaticOutcomeDate: restInstanceModule.automaticOutcomeDate
        ? dayjs(restInstanceModule.automaticOutcomeDate, DATE_TIME_FORMAT_ISO)
        : undefined,
      manualOutcomeDate: restInstanceModule.manualOutcomeDate
        ? dayjs(restInstanceModule.manualOutcomeDate, DATE_TIME_FORMAT_ISO)
        : undefined,
    };
  }
}
