# Ricerca Operazioni — Set di Prompt di Implementazione

Questo documento contiene una sequenza di prompt ordinati per implementare la feature "Ricerca Operazioni" nel progetto `pagopa-cruscotto-frontend`.

Ogni prompt è autonomo ma fa riferimento a quanto prodotto dai prompt precedenti.
Prima di eseguire un prompt, assicurarsi che tutti i prompt precedenti siano stati eseguiti con successo.

## Indice

| #   | File prompt                                      | Cosa produce                                                   |
| --- | ------------------------------------------------ | -------------------------------------------------------------- |
| 01  | [01-models.md](01-models.md)                     | Interfacce TypeScript e mock                                   |
| 02  | [02-authority.md](02-authority.md)               | Costante Authority                                             |
| 03  | [03-i18n.md](03-i18n.md)                         | File di traduzione it/en                                       |
| 04  | [04-service.md](04-service.md)                   | Service Angular (HTTP + mock)                                  |
| 05  | [05-filter.md](05-filter.md)                     | Filter class per la paginazione                                |
| 06  | [06-routes.md](06-routes.md)                     | Routes (lista + dettaglio) + registrazione in entity.routes.ts |
| 07  | [07-list-component.md](07-list-component.md)     | Componente lista con filtri e tabella risultati                |
| 08  | [08-detail-component.md](08-detail-component.md) | Componente dettaglio (TAB Tokens / TAB Eventi con expand)      |
| 09  | [09-header.md](09-header.md)                     | Bottone nell'intestazione (header)                             |
