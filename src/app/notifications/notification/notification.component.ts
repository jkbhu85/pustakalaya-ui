import {
  Component,
  OnInit,
  Input
} from '@angular/core';

import { Notification } from '../notification';
import { NotiType } from '../noti-type.enum';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notification',
  template:
    `
<div class="alert alert-dismissible fade show" [ngClass]="{
  'alert-info': notification.type === notiType.INFO,
  'alert-success': notification.type === notiType.SUCCESS,
  'alert-warning': notification.type === notiType.WARN,
  'alert-danger': notification.type === notiType.DANGER
}" role="alert">
<span>{{ notification.message }}</span>
<button type="button" (click)="onDelete()" data-dismiss="alert" class="close" aria-label="Close">
  <span aria-hidden="true">&times;</span>
</button>
</div>
`
})
export class NotificationComponent implements OnInit {
  @Input() notification: Notification;
  notiType = NotiType;

  constructor(private notiService: NotificationService) { }

  ngOnInit() {
  }

  onDelete() {
    let that = this;
    window.setTimeout(function () {
      that.notiService.removeNotification(this.notification)
    }, 200);
  }

}
