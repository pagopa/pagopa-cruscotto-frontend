# Prompt 02 — Costante Authority

## Contesto

Le autorizzazioni sono centralizzate nel file:
`src/main/webapp/app/config/authority.constants.ts`

Il file definisce l'enum `Authority`. Ogni voce ha forma `NOME_COSTANTE = 'GTW.NOME_COSTANTE'`.

## Obiettivo

Aggiungere alla fine dell'enum `Authority` la nuova voce:

```typescript
RICERCA_OPERAZIONI_INQUIRY = 'GTW.RICERCA_OPERAZIONI_INQUIRY',
```

## Istruzioni

1. Aprire `src/main/webapp/app/config/authority.constants.ts`.
2. Aggiungere la riga prima della parentesi graffa di chiusura dell'enum.
3. Non modificare nessun'altra riga.

## ⚠️ Note

- Il nome `GTW.RICERCA_OPERAZIONI_INQUIRY` è un placeholder.
  **Sostituire con il valore reale definito nel backend.**
