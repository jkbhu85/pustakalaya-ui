import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppBaseModule } from './app-base/app-base.module';
import { AppComponent } from './app-base/app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppSecurityModule } from './app-security/app-security.module';
import { BookModule } from './book/book.module';
import { CountryModule } from './country/country.module';
import { MiscModule } from './misc/misc.module';
import { NotificationModule } from './notifications/notifications.module';
import { AppTranslateService } from './services/app-translate.service';
import { CurrencyService } from './services/currency.service';
import { LocaleService } from './services/locale.service';
import { UserModule } from './user/user.module';

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
    CountryModule,
    AppRoutingModule
  ],
  providers: [AppTranslateService, CurrencyService, LocaleService],
  bootstrap: [AppComponent]
})
export class AppModule {}
