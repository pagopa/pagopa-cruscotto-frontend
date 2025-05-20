import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KpiB2Result } from '../models/KpiB2Result';

@Injectable({
  providedIn: 'root',
})
export class KpiB2Service {
  private baseUrl = '/api/kpi-results/b2/module'; // URL base per l'endpoint backend

  constructor(private http: HttpClient) {}

  /**
   * Recupera i KPI di tipo B2 associati a un dato modulo
   *
   * @param moduleId - ID del modulo per cui recuperare i KPI
   * @returns Observable con l'array dei risultati KpiB2Result
   */
  getKpiB2Results(moduleId: number): Observable<KpiB2Result[]> {
    const url = `${this.baseUrl}/${moduleId}`;
    return this.http.get<KpiB2Result[]>(url).pipe(
      catchError(this.handleError), // Gestione degli errori
    );
  }

  /**
   * Gestisce gli errori provenienti dal backend
   *
   * @param error - Oggetto generato in caso di errore HTTP
   * @returns Observable che emette un errore personalizzato
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Errore Back-end', error); // Log dell'errore lato backend
    let errorMessage = 'Si è verificato un errore imprevisto.';

    if (error.error instanceof ErrorEvent) {
      // Errore lato client
      errorMessage = `Errore Client: ${error.error.message}`;
    } else {
      // Errore lato server
      errorMessage = `Errore Server: Codice ${error.status}, Messaggio: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
