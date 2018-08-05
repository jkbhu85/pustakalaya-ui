import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleLibrianGaurd } from '../app-security/role-librarian-gaurd';
import { AddUserComponent } from './add-user/add-user.component';
import { UserComponent } from './user.component';
import { AuthGaurd } from '../app-security/auth-gaurd.service';
import { CompleteRegistrationComponent } from './complete-registration/complete-registration.component';
import { NoAuthGaurd } from '../app-security/no-auth-gaurd';
import { RegistrationGaurd } from './registration-gaurd';

const userRoutes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    children: [
      {
        path: '',
        redirectTo: 'add',
        pathMatch: 'full'
      },
      {
        path: 'add',
        component: AddUserComponent,
        canActivate: [RoleLibrianGaurd, AuthGaurd]
      },
      {
        path: 'register',
        component: CompleteRegistrationComponent,
        canActivate: [NoAuthGaurd, RegistrationGaurd]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(userRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class UserRoutingModule { }
