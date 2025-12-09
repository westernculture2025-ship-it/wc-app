import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AlertService, AlertMessage } from '../../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class AlertComponent implements OnDestroy {
  alerts: (AlertMessage & { id: number })[] = [];
  private subscription?: Subscription;
  private nextId = 0;

  constructor(
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {
    this.subscription = this.alertService.alert$.subscribe(alert => {
      const alertWithId = { ...alert, id: this.nextId++ };
      this.alerts.push(alertWithId);
      this.cdr.detectChanges();

      setTimeout(() => {
        this.removeAlert(alertWithId.id);
      }, alert.duration || 3000);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  removeAlert(id: number): void {
    this.alerts = this.alerts.filter(alert => alert.id !== id);
    this.cdr.detectChanges();
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '';
    }
  }
}
