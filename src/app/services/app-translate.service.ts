import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';


/**
 * This class sets the locale for the application to use.
 * The locale can be changed any time using provided methods.
 */
@Injectable()
export class AppTranslateService {
  readonly supportedLangs = ['en-US', 'hi-IN'];
  readonly defaultLang = this.supportedLangs[1];

  constructor(
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang(this.defaultLang);
    this.translate.use(this.defaultLang);
    console.log('Using language: ' + this.translate.currentLang);
  }

  /**
   * Sets specified locale value to be used by the application if
   * the specified locale is supported by the application.
   * 
   * @param userLocale locale value to be set
   */
  public setUserLocale(userLocale: string): void {
    userLocale = this.normalizeLocale(userLocale);

    if (!this.isLocaleSupported(userLocale)) return;

    if (this.translate.currentLang === userLocale) return;

    this.translate.use(userLocale);
  }

  private normalizeLocale(locale): string {
    if (!locale) return;

    try {
      locale = locale.split('_').join('-');
    } catch (e) {
      return '';
    }

    return locale;
  }

  public currentLocale(): string {
    return this.translate.currentLang;
  }

  private isLocaleSupported(locale: string): boolean {
    if (!locale) return false;

    locale = locale.split('_').join('-');

    for (let l of this.supportedLangs) {
      if (l === locale) return true;
    }

    return false;
  }

  /**
   * Returns a string associated with specified {@code key} for current locale.
   * 
   * @param key the key for which tranlation is needed
   */
  public get(key: string): Observable<any> {
    return this.translate.get(key);
  }

}
