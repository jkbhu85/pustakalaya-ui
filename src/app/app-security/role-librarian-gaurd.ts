import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserRole } from '../models/user';
import { AuthService } from './auth.service';

@Injectable()
export class RoleLibrianGaurd implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.userHasRole(UserRole.LIBRARIAN);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.authService.userHasRole(UserRole.LIBRARIAN);
  }
}
