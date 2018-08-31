import { Injectable } from '@angular/core';
import { AuthInfo, UserRole } from '../models/user';
import { Router } from '@angular/router';
import { NotificationService } from '../notifications/notification.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppTranslateService } from '../services/app-translate.service';

const HOME_PAGE = '/home';
const LOGIN_PAGE = '/login';

@Injectable()
export class AuthService {
  private readonly storage: Storage = localStorage; // sessionStorage;
  private readonly tokenLabel: string = 'json_web_token';
  private readonly userLabel: string = 'user_info';

  private user: AuthInfo;
  private loggedIn: boolean;

  private user$ = new BehaviorSubject<AuthInfo>(this.user);
  private loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

  private timeoutHolder: number;
  private autoLogout = false;

  constructor(private router: Router, private notiService: NotificationService, private translate: AppTranslateService) {
    console.log('AuthService created');
    this.restore();
  }

  private onAutoLogout() {
    this.autoLogout = true;

    this.logout();
    this.router.navigate(['']);
    this.notiService.danger('login.vld.loginExpired');

    this.timeoutHolder = 0;

    this.autoLogout = false;
    console.log('autoLogout performed');
  }

  // auto-logout is activate either from login or reload
  private activateAutoLogout() {
    if (!this.loggedIn) return;

    let timeout = (this.user.localExp - Math.floor(Date.now() / 1000)) * 1000;

    this.timeoutHolder = window.setTimeout(() => {
      this.onAutoLogout();
    }, timeout);

    console.log('autoLogout activated. time remaining: ' + timeout + ' ms');
  }

  private deactivateAutoLogout() {
    if (this.timeoutHolder) {
      window.clearTimeout(this.timeoutHolder);
      this.timeoutHolder = 0;

      console.log('autoLogout deactivated');
    }
  }

  // save JWT to storage
  private saveJwt(jwt: string) {
    this.storage.setItem(this.tokenLabel, jwt);
  }

  // remove JWT from storage
  private removeJwt() {
    this.storage.removeItem(this.tokenLabel);
  }

  // save user to this object's state and to storage
  private saveUser(userJson: string) {
    let user: AuthInfo = JSON.parse(userJson);

    // check if local time of token expiration is set
    // if not set, set expiration time
    // local expiration time is set as seconds now + difference in
    // exp and iat fields
    if (!user.localExp) {
      let now = new Date();
      let seconds = Math.floor(now.getTime() / 1000);
      user.localExp = seconds + (user.exp - user.iat);
    }

    this.updateUser(user);

    this.storage.setItem(this.userLabel, JSON.stringify(user));
  }

  // removes user from this object's state and from storage
  private removeUser() {
    this.updateUser(null);
    this.storage.removeItem(this.userLabel);
  }

  /**
   * Changes the login status and informs all the subscribers.
   */
  private updateLoginStatus() {
    this.loggedIn = this.storage.getItem(this.tokenLabel) ? true : false;
    this.loggedIn$.next(this.loggedIn);
  }

  private updateUser(newUser: AuthInfo) {
    this.user = newUser;
    this.user$.next(this.user);
    if (newUser) {
      this.translate.setUserLocale(this.user.locale);
    }
  }

  /**
   * Restores user from storage if application reloads.
   * Removes all information if JWT expired already.
   */
  private restore() {
    let userJson = this.storage.getItem(this.userLabel);

    if (userJson) this.saveUser(userJson);

    // clear everything if JWT expired
    if (this.isJwtExpired()) {
      this.clearAll();
    }

    this.updateLoginStatus();
    this.activateAutoLogout();
  }

  // remove all user information and JWT from object and storage
  private clearAll() {
    this.removeJwt();
    this.removeUser();
  }

  private isJwtExpired(): boolean {
    if (!this.user) return true;

    let now = Math.floor(Date.now() / 1000);

    return now > this.user.localExp;
  }

  private getUserJsonFromJwt(jwt: string): string {
    jwt = jwt.split(' ')[1];
    let payload = jwt.split('.')[1];
    let base64 = payload.replace('-', '+').replace('_', '/');

    return window.atob(base64);
  }

  /**
   * Stores user authentication information (JWT) to be used by the
   * application.
   * @param jwt JWT token string
   */
  login(jwt: string): void {
    this.saveJwt(jwt);

    let userJson = this.getUserJsonFromJwt(jwt);
    this.saveUser(userJson);

    this.updateLoginStatus();
    this.activateAutoLogout();

    this.router.navigate([HOME_PAGE]);
  }

  /**
   * Returns JWT string.
   */
  getJwt(): string {
    return this.storage.getItem(this.tokenLabel);
  }

  /**
   * Returns user information.
   *
   */
  getUserInfo(): Observable<AuthInfo> {
    return this.user$;
  }

  isAccountComplete(): boolean {
    if (!this.user) return false;

    return this.user.name && this.user.name.length > 0;
  }

  /**
   * Returns `true` if user has the specified role, `false` otherwise.
   *
   * @param role the role to check aginst user information
   */
  userHasRole(role: UserRole): boolean {
    if (!this.user) return false;

    let userRoleNum = this.getRoleNumber(UserRole[this.user.role]);
    let roleNum = this.getRoleNumber(role);

    return userRoleNum >= roleNum;
  }

  private getRoleNumber(role: UserRole): number {
    switch (role) {
      case UserRole.ADMIN:
        return 3;
      case UserRole.LIBRARIAN:
        return 2;
      case UserRole.MEMBER:
        return 1;
      default:
        return 0;
    }
  }

  /**
   * Returns login status.
   */
  getLoginStatus(): Observable<boolean> {
    return this.loggedIn$;
  }

  /**
   * Returns `true` if user is logged in, `false` otherwise.
   */
  isLoggedIn(): boolean {
    if (!this.storage.getItem(this.tokenLabel)) {
      this.logout();
    }
    return this.loggedIn;
  }

  /**
   * Logs out user by removing all information.
   */
  logout(): void {
    if (!this.loggedIn) return;

    this.clearAll();
    this.updateLoginStatus();

    if (!this.autoLogout) this.deactivateAutoLogout();
    this.router.navigate([LOGIN_PAGE]);
  }
}
