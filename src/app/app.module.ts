import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app-base/app.component';
import { AppBaseModule } from './app-base/app-base.module';
import { NotificationModule } from './notifications/notifications.module';
import { AppTranslateService } from './services/app-translate.service';
import { AppRoutingModule } from './/app-routing.module';
import { AppSecurityModule } from './app-security/app-security.module';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { MiscModule } from './misc/misc.module';
import { TokenInterceptor } from './app-security/token-interceptor';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/');
}


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NotificationModule,
    AppBaseModule,
    AppSecurityModule,
    BookModule,
    UserModule,
    MiscModule,
    AppRoutingModule
  ],
  providers: [
    AppTranslateService
  ],
  bootstrap: [AppComponent],
  declarations: [CompleteProfileComponent]
})
export class AppModule { }
