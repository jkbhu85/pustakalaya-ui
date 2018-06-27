import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppTranslateService } from '../services/app-translate.service';
import { AuthService } from '../app-security/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  loggedIn = false;
  private subscription: Subscription;

  constructor(
    private authService: AuthService,
    private translate: AppTranslateService // don't remove. to instantiate the service when application loads
  ) {}

  ngOnInit() {
    this.subscription = this.authService.getLoginStatus().subscribe((status) => this.loggedIn = status);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
