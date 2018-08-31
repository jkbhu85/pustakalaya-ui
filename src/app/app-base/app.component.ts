import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../app-security/auth.service';
import { AppTranslateService } from '../services/app-translate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  loggedIn = false;
  private subscription: Subscription;

  constructor(
    private authService: AuthService,
    private translate: AppTranslateService // don't remove. to instantiate the service when application loads
  ) {}

  ngOnInit() {
    this.subscription = this.authService
      .getLoginStatus()
      .subscribe(status => (this.loggedIn = status));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
