import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PagoPaPaymentReceiptComponent } from './list/payment-receipt.component';
import { Authority } from 'app/config/authority.constants';

const paymentReceiptRoutes: Routes = [
  {
    path: '',
    component: PagoPaPaymentReceiptComponent,
    data: {
      authorities: [Authority.PAGOPA_PAYMENT_RECEIPT_INQUIRY],
    },
    canActivate: [UserRouteAccessService],
  },
];

export default paymentReceiptRoutes;
