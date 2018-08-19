import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchBookComponent } from '../../book/search-book/search-book.component';
import { AuthGaurd } from '../../app-security/auth-gaurd.service';
import { RoleLibrianGaurd } from '../../app-security/role-librarian-gaurd';

const miscRoutes: Routes = [
  {
    path: 'bookSearch',
    component: SearchBookComponent,
    canActivate: [AuthGaurd, RoleLibrianGaurd]
  }
];

@NgModule({
  imports: [RouterModule.forChild(miscRoutes)],
  exports: [RouterModule]
})
export class MiscRoutingModule {}
