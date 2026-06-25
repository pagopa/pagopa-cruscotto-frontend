import { Injectable } from '@angular/core';
import { IFilterPagination } from '../../../../shared/pagination/filter.pagination';
import { IParam, ISortField, TypeData } from '../../../../shared/pagination/filter.model';
import { RicercaOperazioniMode } from '../models/ricerca-operazioni.model';

@Injectable({ providedIn: 'root' })
export class RicercaOperazioniFilter extends IFilterPagination {
  /** Campo facoltativo — Codice Fiscale PA Emittente (11 cifre) */
  static PA_EMITTENTE: IParam = {
    name: 'paEmittente',
    req: 'paEmittente',
    type: TypeData.STRING,
    defaultValue: '',
  };

  /** Numero Avviso (NAV) — esclusivo con gli altri campi di ricerca */
  static NAV: IParam = { name: 'nav', req: 'nav', type: TypeData.STRING, defaultValue: '' };

  /** IUV / Creditor Reference ID — esclusivo con gli altri campi di ricerca */
  static IUV: IParam = { name: 'iuv', req: 'iuv', type: TypeData.STRING, defaultValue: '' };

  /** Token transazione — esclusivo con gli altri campi di ricerca */
  static TOKEN: IParam = { name: 'token', req: 'token', type: TypeData.STRING, defaultValue: '' };

  /** ID Carrello — esclusivo con gli altri campi di ricerca */
  static ID_CARRELLO: IParam = { name: 'idCarrello', req: 'idCarrello', type: TypeData.STRING, defaultValue: '' };

  /** Informazioni Aggiuntive (valore) — esclusivo con gli altri campi di ricerca */
  static EXTRA: IParam = { name: 'extra', req: 'extra', type: TypeData.STRING, defaultValue: '' };

  /** Modalità di ricerca attiva, determinata dal campo esclusivo valorizzato */
  mode?: RicercaOperazioniMode;

  sort: ISortField = { field: 'paEmittente', direction: 'asc' };
  sortDefault: ISortField = { field: 'paEmittente', direction: 'asc' };

  override clear(): void {
    super.clear();
    this.mode = undefined;
  }
}
