import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AlertMessage {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new Subject<AlertMessage>();
  public alert$ = this.alertSubject.asObservable();

  success(message: string, duration: number = 3000): void {
    this.show('success', message, duration);
  }

  error(message: string, duration: number = 4000): void {
    this.show('error', message, duration);
  }

  info(message: string, duration: number = 3000): void {
    this.show('info', message, duration);
  }

  warning(message: string, duration: number = 3500): void {
    this.show('warning', message, duration);
  }

  private show(type: 'success' | 'error' | 'info' | 'warning', message: string, duration: number): void {
    this.alertSubject.next({ type, message, duration });
  }
}
