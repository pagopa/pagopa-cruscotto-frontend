# Prompt 06 — Routes

## Contesto

Le routes delle entità sono strutturate per lazy loading.
Prendere come riferimento:

- `src/main/webapp/app/entity/instance/route/instance.routes.ts` per la struttura con lista + dettaglio.
- `src/main/webapp/app/entity/entity.routes.ts` per la registrazione lazy del modulo.

## Obiettivo

### File 1 — Creare `src/main/webapp/app/entity/pago-pa/ricerca-operazioni/ricerca-operazioni.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Authority } from 'app/config/authority.constants';

const ricercaOperazioniRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/ricerca-operazioni.component').then(m => m.RicercaOperazioniComponent),
    data: {
      authorities: [Authority.RICERCA_OPERAZIONI_INQUIRY],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':positionId/view',
    loadComponent: () => import('./detail/ricerca-operazioni-detail.component').then(m => m.RicercaOperazioniDetailComponent),
    data: {
      authorities: [Authority.RICERCA_OPERAZIONI_INQUIRY],
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ricercaOperazioniRoutes;
```

### File 2 — Aggiornare `src/main/webapp/app/entity/entity.routes.ts`

Aggiungere in coda all'array `entityRoutes`:

```typescript
{
  path: 'pago-pa/ricerca-operazioni',
  loadChildren: () => import('./pago-pa/ricerca-operazioni/ricerca-operazioni.routes'),
},
```

## Note

- Il path `'pago-pa/ricerca-operazioni'` produce URL `/entity/pago-pa/ricerca-operazioni`.
- Il dettaglio sarà raggiungibile all'URL `/entity/pago-pa/ricerca-operazioni/:positionId/view`.
- Non usare un `RoutingResolve` separato: il componente di dettaglio caricherà i dati
  in autonomia tramite il service, leggendo il parametro `positionId` da `ActivatedRoute`.
