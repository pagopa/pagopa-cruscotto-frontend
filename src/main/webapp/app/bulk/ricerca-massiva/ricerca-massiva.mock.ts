import {
  PageAnagIntermediarioPa,
  PageAnagPaEmittente,
  PageAnagPsp,
  PageAnagStazione,
  PageString,
  SearchInstanceDTO,
} from '../models/bulk-search.model';

export interface BulkCsvValidationError {
  row: number;
  column: string;
  message: string;
}

export const RICERCA_MASSIVA_CSV_VALIDATION_ERRORS: BulkCsvValidationError[] = [
  { row: 2, column: 'NAV', message: 'Il valore è obbligatorio.' },
  { row: 5, column: 'Importo', message: 'Il valore deve essere numerico.' },
  { row: 8, column: 'IUV', message: 'Il formato del valore non è valido.' },
];

export const RICERCA_MASSIVA_LOOKUPS: {
  touchpoints: PageString;
  paymentMethods: PageString;
  creditorInstitutions: PageAnagPaEmittente;
  psp: PageAnagPsp;
  intermediaries: PageAnagIntermediarioPa;
  stations: PageAnagStazione;
} = {
  touchpoints: { content: ['App IO', 'Home Banking', 'Sportello fisico'] },
  paymentMethods: { content: ['Carta di credito', 'Conto corrente', 'Bollettino postale'] },
  creditorInstitutions: {
    content: [
      { id: 1, codice: '01234567890', description: 'Comune di Milano' },
      { id: 2, codice: '09876543210', description: 'Comune di Roma' },
    ],
  },
  psp: {
    content: [
      { id: 1, codice: 'PSP001', description: 'PagoPA S.p.A.' },
      { id: 2, codice: 'PSP002', description: 'Banca Demo' },
    ],
  },
  intermediaries: {
    content: [
      { id: 1, codice: 'INT001', description: 'Intermediario Demo' },
      { id: 2, codice: 'INT002', description: 'Partner Tecnologico Demo' },
    ],
  },
  stations: {
    content: [
      { id: 1, codice: 'STAZIONE001' },
      { id: 2, codice: 'STAZIONE002' },
    ],
  },
};

// TODO: dati di esempio da rimuovere quando l'endpoint /api/bulk/search-instances sarà disponibile.
export const RICERCA_MASSIVA_MOCK: SearchInstanceDTO[] = [
  {
    id: '1a2b3c4d-0001-4a10-9b11-000000000001',
    name: 'Estrazione RPT gennaio',
    inputType: 'CSV',
    status: 'DRAFT',
    createdAt: '2026-01-12T09:15:00Z',
    updatedAt: '2026-01-12T09:15:00Z',
  },
  {
    id: '1a2b3c4d-0002-4a10-9b11-000000000002',
    name: 'Verifica NAV enti lombardia',
    inputType: 'CSV',
    status: 'PLANNED',
    createdAt: '2026-02-03T14:42:10Z',
    updatedAt: '2026-02-04T08:00:00Z',
  },
  {
    id: '1a2b3c4d-0003-4a10-9b11-000000000003',
    name: 'Riconciliazione flussi febbraio',
    inputType: 'MANUAL',
    status: 'RUNNING',
    createdAt: '2026-02-20T07:05:33Z',
    updatedAt: '2026-02-20T07:30:00Z',
  },
  {
    id: '1a2b3c4d-0004-4a10-9b11-000000000004',
    name: 'Controllo IUV duplicati',
    inputType: 'CSV',
    status: 'COMPLETED',
    createdAt: '2026-03-08T11:20:00Z',
    updatedAt: '2026-03-08T12:05:00Z',
  },
  {
    id: '1a2b3c4d-0005-4a10-9b11-000000000005',
    name: 'Estrazione posizioni scadute',
    inputType: 'MANUAL',
    status: 'FAILED',
    createdAt: '2026-04-17T16:48:21Z',
    updatedAt: '2026-04-17T16:59:02Z',
  },
  {
    id: '1a2b3c4d-0006-4a10-9b11-000000000006',
    name: 'Analisi carrelli multi-beneficiario',
    inputType: 'CSV',
    status: 'COMPLETED',
    createdAt: '2026-05-02T10:00:00Z',
    updatedAt: '2026-05-02T10:45:00Z',
  },
  {
    id: '1a2b3c4d-0007-4a10-9b11-000000000007',
    name: 'Ricerca token stand-in',
    inputType: 'MANUAL',
    status: 'DRAFT',
    createdAt: '2026-06-11T08:31:47Z',
    updatedAt: '2026-06-11T08:31:47Z',
  },
  {
    id: '1a2b3c4d-0008-4a10-9b11-000000000008',
    name: 'Estrazione ricevute trimestre 2',
    inputType: 'CSV',
    status: 'PLANNED',
    createdAt: '2026-07-01T13:12:00Z',
    updatedAt: '2026-07-01T13:12:00Z',
  },
  {
    id: '1a2b3c4d-0009-4a10-9b11-000000000009',
    name: 'Verifica pagamenti GPD',
    inputType: 'MANUAL',
    status: 'RUNNING',
    createdAt: '2026-08-05T09:58:12Z',
    updatedAt: '2026-08-05T10:10:00Z',
  },
  {
    id: '1a2b3c4d-0010-4a10-9b11-000000000010',
    name: 'Estrazione massiva agosto',
    inputType: 'CSV',
    status: 'ARCHIVED',
    createdAt: '2026-08-21T18:03:55Z',
    updatedAt: '2026-08-22T07:00:00Z',
  },
];

// TODO: rimuovere quando l'endpoint GET /api/bulk/search-instances/{id} sarà disponibile.
export function getRicercaMassivaDetailMock(id: string): SearchInstanceDTO {
  const base = RICERCA_MASSIVA_MOCK.find(instance => instance.id === id);
  return {
    ...base,
    id,
    searchCriteria: {
      periodStart: '2026-01-01T00:00:00.000Z',
      periodEnd: '2026-01-31T00:00:00.000Z',
      paymentOutcome: 'OK',
      touchpoint: RICERCA_MASSIVA_LOOKUPS.touchpoints.content?.[0],
      paymentMethod: RICERCA_MASSIVA_LOOKUPS.paymentMethods.content?.[0],
      amountMin: 10,
      amountMax: 1000,
      creditorInstitutionId: RICERCA_MASSIVA_LOOKUPS.creditorInstitutions.content?.[0]?.id,
      pspId: RICERCA_MASSIVA_LOOKUPS.psp.content?.[0]?.id,
      intermediaryId: RICERCA_MASSIVA_LOOKUPS.intermediaries.content?.[0]?.id,
      stationId: RICERCA_MASSIVA_LOOKUPS.stations.content?.[0]?.id,
    },
  };
}
