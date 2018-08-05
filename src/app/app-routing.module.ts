import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './app-base/home/home.component';
import { PageNotFoundComponent } from './app-base/page-not-found.component';
import { AuthGaurd } from './app-security/auth-gaurd.service';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { ProfileIncompleteGaurd } from './app-security/gaurds/profile-incomplete-gaurd';

const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: 'completeProfile',
    component: CompleteProfileComponent,
    canActivate: [AuthGaurd, ProfileIncompleteGaurd]
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
