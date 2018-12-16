import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurd } from '../app-security/auth-gaurd.service';
import { AddBookComponent } from './add-book/add-book.component';
import { RoleLibrianGaurd } from '../app-security/role-librarian-gaurd';
import { RemoveBookComponent } from './remove-book/remove-book.component';
import { AssignBookComponent } from './assign-book/assign-book.component';
import { BookComponent } from './book.component';
import { SearchBookComponent } from './search-book/search-book.component';
import { ReturnBookComponent } from './return-book/return-book.component';


const bookRoutes: Routes = [
  {
    path: 'book',
    component: BookComponent,
    canActivateChild: [AuthGaurd],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'assign'
      },
      {
        path: '',
        canActivateChild: [RoleLibrianGaurd],
        children: [
          {
            path: 'add',
            component: AddBookComponent
          },
          {
            path: 'remove',
            component: RemoveBookComponent
          },
          {
            path: 'assign',
            component: AssignBookComponent
          },
          {
            path: 'return',
            component: ReturnBookComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(bookRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class BookRoutingModule { }
