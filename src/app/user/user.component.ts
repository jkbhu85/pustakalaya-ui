import { Component, OnInit } from '@angular/core';

@Component({
  template: `
  <div class="row">
    <div class="col-12">
      <h1 class="mb-3">{{'navbar.user' | translate}}</h1>

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
