import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { UserRole } from "../models/models";

@Injectable()
export class ProfileCompleteGaurd implements CanActivate, CanActivateChild{
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let accountComplete = this.authService.isAccountComplete();

    if (!accountComplete) {
      this.router.navigate(['/completeProfile']);
    }

    return accountComplete;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
