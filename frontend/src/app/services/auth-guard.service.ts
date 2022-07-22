import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    //console.log(this.authService);
    const isLoggedIn = this.authService.isLogedIn();
    // console.log(isLoggedIn);
    if (isLoggedIn) {
      return true;
    } else {
      //this.router.navigate(['/login']);
      // Check whether User is Logedin by requesting it from the server
      console.log('asked Server');
      const user = await firstValueFrom(this.authService.getUser()).catch(err => console.log('error: ' + err));
      console.log('user: ', user);
      if (user) {
        //console.log(user);
        return true;
      }
      console.log('User not logged in. Redirecting to login.');
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }

}
