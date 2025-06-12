import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PagoPaPaymentReceiptComponent } from './list/payment-receipt.component';

const paymentReceiptRoutes: Routes = [
  {
    path: '',
    component: PagoPaPaymentReceiptComponent,
    canActivate: [UserRouteAccessService],
  },
];

export default paymentReceiptRoutes;
