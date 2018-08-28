import { NgModule } from '@angular/core';
import { NotificationComponent } from './notification.component';
import { NotificationGroupComponent } from './notification-group.component';
import { NotificationService } from './notification.service';
import { AppCommonModule } from '../modules/app-common.module';
import { BlockUiComponent } from './block-ui.component';
import { BlockUiService } from './block-ui.service';

@NgModule({
    declarations: [
        BlockUiComponent,
        NotificationComponent,
        NotificationGroupComponent
    ],
    imports: [
        AppCommonModule
    ],
    exports: [
        BlockUiComponent,
        NotificationGroupComponent
    ],
    providers: [
        NotificationService,
        BlockUiService
    ]
})
export class NotificationModule { }
