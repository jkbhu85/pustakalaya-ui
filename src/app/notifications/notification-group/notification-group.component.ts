import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';
import { Notification } from '../notification';

@Component({
    selector: 'app-notification-group',
    template:
        `
<app-notification
    *ngFor="let notification of notifications"
    [notification]="notification">
</app-notification>
`
})
export class NotificationGroupComponent implements OnInit {
    notifications: Notification[];

    constructor(notiService: NotificationService) {
        this.notifications = notiService.getAllNotifications();
    }

    ngOnInit() { }
}
