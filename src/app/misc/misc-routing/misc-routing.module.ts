import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchBookComponent } from '../../book/search-book/search-book.component';
import { AuthGaurd } from '../../app-security/auth-gaurd.service';
import { UserProfileComponent } from '../../user/profile/profile.component';

const miscRoutes: Routes = [
  {
    path: 'bookSearch',
    component: SearchBookComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGaurd]
  }
];

@NgModule({
  imports: [RouterModule.forChild(miscRoutes)],
  exports: [RouterModule]
})
export class MiscRoutingModule {}
