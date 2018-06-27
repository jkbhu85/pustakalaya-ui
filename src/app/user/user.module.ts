import { NgModule } from '@angular/core';
import { UserRoutingModule } from './/user-routing.module';
import { AddUserComponent } from './add-user/add-user.component';
import { ModifyUserComponent } from './modify-user/modify-user.component';
import { UserComponent } from './user.component';
import { AppCommonModule } from '../modules/app-common.module';

@NgModule({
  imports: [
    AppCommonModule,
    UserRoutingModule
  ],
  declarations: [AddUserComponent, ModifyUserComponent, UserComponent]
})
export class UserModule { }
