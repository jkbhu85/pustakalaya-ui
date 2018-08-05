import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { AppSecurityRoutingModule } from './app-security-routing.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AppCommonModule } from '../modules/app-common.module';
import { AuthService } from './auth.service';
import { AuthGaurd } from './auth-gaurd.service';
import { NoAuthGaurd } from './no-auth-gaurd';
import { RoleAdminGaurd } from './role-admin-gaurd';
import { RoleLibrianGaurd } from './role-librarian-gaurd';
import { ProfileIncompleteGaurd } from './gaurds/profile-incomplete-gaurd';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token-interceptor';

@NgModule({
  imports: [
    AppCommonModule,
    AppSecurityRoutingModule
  ],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent
  ],
  providers: [
    AuthService,
    AuthGaurd,
    NoAuthGaurd,
    RoleAdminGaurd,
    RoleLibrianGaurd,
    ProfileIncompleteGaurd,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ]
})
export class AppSecurityModule { }
