import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchBookComponent } from './search-book/search-book.component';
import { ProfileCompleteGaurd } from '../app-security/profile-complete-gaurd';
import { AuthGaurd } from '../app-security/auth-gaurd.service';
import { AddBookComponent } from './add-book/add-book.component';
import { RoleLibrianGaurd } from '../app-security/role-librarian-gaurd';
import { RemoveBookComponent } from './remove-book/remove-book.component';
import { AssignBookComponent } from './assign-book/assign-book.component';
import { BookComponent } from './book.component';


const bookRoutes: Routes = [
  {
    path: 'book',
    component: BookComponent,
    canActivateChild: [AuthGaurd, ProfileCompleteGaurd],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'add'
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
