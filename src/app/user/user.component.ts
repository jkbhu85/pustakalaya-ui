import { Component, OnInit } from '@angular/core';

@Component({
  template: `
  <div class="row">
    <div class="col-12">
      <h1 class="mb-3">{{'navbar.user' | translate}}</h1>
      <ul class="ptk-inline-nav">
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

  constructor() { }

  ngOnInit() {
  }

}
