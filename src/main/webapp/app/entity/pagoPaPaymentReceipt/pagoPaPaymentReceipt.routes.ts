import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PagoPaPaymentReceiptComponent } from './list/pagoPaPaymentReceipt.component';

const pagoPaPaymentReceiptRoutes: Routes = [
  {
    path: '',
    component: PagoPaPaymentReceiptComponent,
    canActivate: [UserRouteAccessService],
  },
];

export default pagoPaPaymentReceiptRoutes;
