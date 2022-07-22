import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(): boolean {

    const isAdmin = this.authService.isAdmin();
    if (isAdmin) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

}

