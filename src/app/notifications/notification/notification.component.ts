import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
  ElementRef
} from '@angular/core';

import { Notification } from '../notification';
import { NotiType } from '../noti-type.enum';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notification',
  template:
    `
<div class="alert alert-dismissible fade show" #alertRef tabindex="-1" [ngClass]="{
  'alert-info': notification.type === notiType.INFO,
  'alert-success': notification.type === notiType.SUCCESS,
  'alert-warning': notification.type === notiType.WARN,
  'alert-danger': notification.type === notiType.DANGER
}" role="alert">
<span *ngIf="notification.message">{{ notification.message }}</span>
<span *ngIf="notification.key">{{ notification.key | translate }}</span>
<button type="button" (click)="onDelete()" data-dismiss="alert" class="close" aria-label="Close">
  <span aria-hidden="true">&times;</span>
</button>
</div>
`
})
export class NotificationComponent implements OnInit, AfterViewInit {
  @Input() notification: Notification;
  @ViewChild('alertRef') alertRef: ElementRef;
  notiType = NotiType;

  constructor(private notiService: NotificationService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => this.alertRef.nativeElement.focus(), 50);
  }

  onDelete() {
    window.setTimeout(() => this.notiService.removeNotification(this.notification), 200);
  }

}
