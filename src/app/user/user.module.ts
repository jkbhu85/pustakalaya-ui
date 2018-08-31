import { NgModule } from '@angular/core';
import { AppCommonModule } from '../modules/app-common.module';
import { AddUserComponent } from './add-user/add-user.component';
import { CompleteRegistrationComponent } from './complete-registration/complete-registration.component';
import { ModifyUserComponent } from './modify-user/modify-user.component';
import { UserProfileComponent } from './profile/profile.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserService } from './user.service';

@NgModule({
  imports: [AppCommonModule, UserRoutingModule],
  declarations: [
    AddUserComponent,
    ModifyUserComponent,
    UserComponent,
    CompleteRegistrationComponent,
    UserProfileComponent
  ],
  providers: [UserService]
})
export class UserModule {}
