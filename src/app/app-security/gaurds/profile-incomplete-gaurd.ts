import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../auth.service";
import { Observable } from "rxjs";

@Injectable()
export class ProfileIncompleteGaurd implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let accountIncomplete = !this.authService.isAccountComplete();

    if (!accountIncomplete) {
      this.router.navigate(['/home']);
    }

    return accountIncomplete;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
