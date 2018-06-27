import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NoAuthGaurd } from './no-auth-gaurd';

const securityRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NoAuthGaurd]
  },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent,
    canActivate: [NoAuthGaurd]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(securityRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppSecurityRoutingModule { }
