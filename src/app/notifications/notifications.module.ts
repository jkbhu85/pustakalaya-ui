import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { NotificationGroupComponent } from './notification-group/notification-group.component';
import { NotificationService } from './notification.service';
import { AppCommonModule } from '../modules/app-common.module';

@NgModule({
    declarations: [
        NotificationComponent,
        NotificationGroupComponent
    ],
    imports: [
        AppCommonModule
    ],
    exports: [
        NotificationGroupComponent
    ],
    providers: [
        NotificationService
    ]
})
export class NotificationModule { }
