import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../app-security/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styles: [
    `
      .full-width {
        width: 100%;
      }
    `
  ]
})
export class FooterComponent implements OnInit, OnDestroy {
  loggedIn = false;
  private subscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.subscription = this.authService
      .getLoginStatus()
      .subscribe(status => (this.loggedIn = status));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
