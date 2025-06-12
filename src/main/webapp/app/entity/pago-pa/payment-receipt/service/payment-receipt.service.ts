import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';
import { ApplicationConfigService } from '../../../../core/config/application-config.service';

import dayjs from 'dayjs/esm';
import { DATE_FORMAT } from 'app/config/input.constants';
import { IPagoPaPaymentReceipt } from '../payment-receipt.model';

type PagoPaPaymentReceiptRestOf<T extends IPagoPaPaymentReceipt> = T & {
  startDate?: string | null;
  endDate?: string | null;
};

export type RestPagoPaPaymentReceipt = PagoPaPaymentReceiptRestOf<IPagoPaPaymentReceipt>;

type EntityResponseType = HttpResponse<IPagoPaPaymentReceipt>;
type EntityArrayResponseType = HttpResponse<IPagoPaPaymentReceipt[]>;

@Injectable({ providedIn: 'root' })
export class PaymentReceiptService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/pagoPaPaymentReceipts');

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPagoPaPaymentReceipt[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertPagoPaPaymentReceiptResponseArrayFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPagoPaPaymentReceipt>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  protected convertResponseFromServer(res: HttpResponse<RestPagoPaPaymentReceipt>): HttpResponse<IPagoPaPaymentReceipt> {
    return res.clone({
      body: res.body ? this.convertPagoPaPaymentReceiptFromServer(res.body) : null,
    });
  }

  protected convertPagoPaPaymentReceiptResponseArrayFromServer(
    res: HttpResponse<RestPagoPaPaymentReceipt[]>,
  ): HttpResponse<IPagoPaPaymentReceipt[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertPagoPaPaymentReceiptFromServer(item)) : null,
    });
  }

  protected convertPagoPaPaymentReceiptFromServer(restPagoPaPaymentReceipt: RestPagoPaPaymentReceipt): IPagoPaPaymentReceipt {
    return {
      ...restPagoPaPaymentReceipt,
      startDate: restPagoPaPaymentReceipt.startDate ? dayjs(restPagoPaPaymentReceipt.startDate, DATE_FORMAT) : undefined,
      endDate: restPagoPaPaymentReceipt.endDate ? dayjs(restPagoPaPaymentReceipt.endDate, DATE_FORMAT) : undefined,
    };
  }
}
