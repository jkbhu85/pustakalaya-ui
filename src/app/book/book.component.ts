import { Component, OnInit } from '@angular/core';

@Component({
  template: `
  <div class="row">
    <div class="col-12">
      <h1 class="mb-3">{{'navbar.book' | translate}}</h1>
      
      <div class="row">
        <div class="col-lg-4 mb-3 mb-md-0">
          <ul class="ptk-inline-nav">
            <li class="float-left float-lg-none">
              <a [routerLink]="['/book/add']" routerLinkActive="ptk-active">{{'navbar.addBook' | translate}}</a>
            </li>
            <li class="float-left float-lg-none">
              <a [routerLink]="['/book/assign']" routerLinkActive="ptk-active">{{'navbar.assignBook' | translate}}</a>
            </li>
            <li class="float-left float-lg-none">
              <a [routerLink]="['/book/remove']" routerLinkActive="ptk-active">{{'navbar.removeBook' | translate}}</a>
            </li>
          </ul>
        </div>

        <div class="col-lg-8">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: []
})
export class BookComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
