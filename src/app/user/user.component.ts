import { Component, OnInit } from '@angular/core';
import { AuthService } from '../app-security/auth.service';
import { Observable } from 'rxjs';

@Component({
  template: `
  <div class="row">
    <div class="col-md-10 col-lg-8 mx-auto">
      <h1 class="mb-3">{{'navbar.user' | translate}}</h1>

      <ul class="ptk-inline-nav" *ngIf="loggedIn$ | async">
        <li>
          <a [routerLink]="['/user/add']" routerLinkActive="ptk-active">{{'navbar.addUser' | translate}}</a>
        </li>
        <li>
          <a [routerLink]="['/user/modify']" routerLinkActive="ptk-active">{{'navbar.modifyUser' | translate}}</a>
        </li>
      </ul>

      <router-outlet></router-outlet>
    </div>
  </div>
  `,
  styles: []
})
export class UserComponent implements OnInit {
  loggedIn$: Observable<boolean>;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.loggedIn$ = this.authService.getLoginStatus();
  }
}
