import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { UserRole, UserInfo } from "../models";

@Injectable()
export class RoleAdminGaurd implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService
  ) {}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.userHasRole(UserRole.ADMIN);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.authService.userHasRole(UserRole.ADMIN);
  }
}
