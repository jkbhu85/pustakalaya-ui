import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../app-security/auth.service';
import { Observable ,  Subscription } from 'rxjs';
import { UserInfo, UserRole } from '../../models/models';
import { AppTranslateService } from '../../services/app-translate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  loggedIn:boolean;
  user: UserInfo;
  
  private loginSubscription: Subscription;
  private userSubscription: Subscription;

  constructor(
    private authService: AuthService,
    public translate: AppTranslateService
  ) {}

  ngOnInit() {
    this.loginSubscription = this.authService.getLoginStatus().subscribe((status) => this.loggedIn = status);
    this.userSubscription = this.authService.getUserInfo().subscribe((user: UserInfo) => this.user = user);
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
    let ele:any = event.target;
    let locale = ele.value;
    this.translate.setUserLocale(locale);
  }

}
