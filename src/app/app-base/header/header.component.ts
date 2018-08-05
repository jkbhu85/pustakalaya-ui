import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../app-security/auth.service';
import { Subscription } from 'rxjs';
import { AuthInfo, UserRole } from '../../models/user';
import { AppTranslateService } from '../../services/app-translate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  loggedIn: boolean;
  user: AuthInfo;
  
  private loginSubscription: Subscription;
  private userSubscription: Subscription;

  constructor(
    private authService: AuthService,
    public translate: AppTranslateService
  ) {}

  ngOnInit() {
    this.loginSubscription = this.authService.getLoginStatus().subscribe((status) => this.loggedIn = status);
    this.userSubscription = this.authService.getUserInfo().subscribe((user: AuthInfo) => this.user = user);
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  hasRole(role: string) {
    return this.authService.userHasRole(UserRole[role]);
  }

  onChangeLang(event: Event) {
    let ele: any = event.target;
    let locale = ele.value;
    this.translate.setUserLocale(locale);
  }

}
