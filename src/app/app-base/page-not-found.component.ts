import { Component, OnInit } from '@angular/core';

@Component({
  template: `
  <h1>{{'common.pageNotFound' | translate}}</h1>
  `
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
