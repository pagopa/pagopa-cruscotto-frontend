# Prompt 09 — Bottone nell'Header

## Contesto

Il componente header è:
`src/main/webapp/app/layouts/header/header.component.ts`

La navigazione è guidata dall'array `menuItems: MenuItem[]` definito nella classe.
Ogni voce di menu ha la struttura:

```typescript
{
  label: string;       // chiave i18n
  route?: string;      // route Angular
  permission?: string; // Authority richiesta
  xSmall: boolean;
  small: boolean;
  medium: boolean;
  large: boolean;
  children?: MenuItem[];
}
```

## Obiettivo

Aggiungere una voce di menu nell'header per navigare a
`/entity/pago-pa/ricerca-operazioni`.

La voce deve apparire:

- Come bottone di primo livello (non dentro un sottomenu) se si vuole accesso diretto.

  **OPPURE**

- Come voce nel sottomenu `registry` (già esistente) — **questa è la scelta consigliata**
  per mantenere coerenza con le altre voci `pago-pa/*`.

## Istruzioni (scelta consigliata: sottomenu `registry`)

### 1. Aggiornare `header.component.ts`

Nel metodo/proprietà `menuItems`, all'interno dell'elemento con
`label: 'global.menu.registry.main'` e relativo array `children`,
aggiungere in coda:

```typescript
{
  label: 'global.menu.registry.ricercaOperazioni',
  route: '/entity/pago-pa/ricerca-operazioni',
  permission: Authority.RICERCA_OPERAZIONI_INQUIRY,
  xSmall: true,
  small: true,
  medium: true,
  large: true,
},
```

### 2. Verificare che `Authority.RICERCA_OPERAZIONI_INQUIRY` sia importato

L'import `Authority` è già presente in cima al file.
Dopo aver eseguito il Prompt 02 la costante sarà disponibile.

### 3. Traduzioni già definite nel Prompt 03

La chiave `global.menu.registry.ricercaOperazioni` è stata aggiunta nei file i18n.

---

## ⚠️ Note

- Se si preferisce un bottone di primo livello (separato da registry), aggiungere
  un nuovo elemento all'array `menuItems` a livello radice, con `children: []`,
  analogamente alla voce `global.menu.instance.main`.
- Consultare `src/main/webapp/app/shared/model/menu-item.model.ts` per verificare
  la struttura completa di `MenuItem` se ci fossero campi aggiuntivi non documentati qui.
