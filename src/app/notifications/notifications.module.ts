import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { NotificationGroupComponent } from './notification-group/notification-group.component';
import { NotificationService } from './notification.service';

@NgModule({
    declarations: [
        NotificationComponent,
        NotificationGroupComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        NotificationGroupComponent
    ],
    providers: [
        NotificationService
    ]
})
export class NotificationModule { }
