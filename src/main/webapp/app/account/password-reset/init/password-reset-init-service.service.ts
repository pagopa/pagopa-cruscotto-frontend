import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PasswordResetInitOutcomeService {
  private subject = new BehaviorSubject<boolean>(false);

  sendSuccess(success: boolean): void {
    this.subject.next(success);
  }

  getSuccess(): Observable<boolean> {
    return this.subject.asObservable();
  }
}
