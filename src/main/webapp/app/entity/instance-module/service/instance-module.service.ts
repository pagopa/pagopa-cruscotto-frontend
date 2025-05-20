import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { IInstanceModule } from '../models/instance-module.model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InstanceModuleService {
  private baseUrl = '/api/instance-modules'; // Cambia con il tuo URL base del backend

  constructor(private http: HttpClient) {}

  /**
   * Ottiene i dettagli di un Module specifico legato a un'istanza
   *
   * @param moduleId ID del modulo
   * @returns Observable con InstanceModuleDTO
   */
  getInstanceModule(moduleId: number): Observable<IInstanceModule> {
    const url = `${this.baseUrl}/${moduleId}`;
    return this.http.get<IInstanceModule>(url).pipe(catchError(this.handleError));
  }

  /**
   * Gestione degli errori provenienti dal backend
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(error);
    let errorMessage = 'Si è verificato un errore.';

    if (error.error instanceof ErrorEvent) {
      // Errore lato client
      errorMessage = `Erroe Client: ${error.error.message}`;
    } else {
      // Errore lato server
      errorMessage = `Errore Server: Codice ${error.status}, Messaggio: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
