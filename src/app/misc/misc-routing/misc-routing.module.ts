import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchBookComponent } from '../../book/search-book/search-book.component';

const miscRoutes:Routes = [
  {
    path: 'bookSearch',
    component: SearchBookComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(miscRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MiscRoutingModule { }
