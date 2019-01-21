import { Injectable } from "@angular/core";
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route
} from "@angular/router";
import { AuthService } from './servicios/auth.service';
// import { AuthService } from './auth.service';

@Injectable({
  providedIn: "root"
})
export class AuthGuardService implements CanActivate, CanActivateChild, CanLoad {
  // implements CanActivate

  constructor(
    private router: Router,
    private authService: AuthService
  ) {} 
  // private auth: AuthService
  // private auth: LoginService, private router: Router
  // canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  //   console.log(next);
  //   console.log('estado del auth: ');
  //   console.log(this.auth.isAuthenticated());
  //   if (this.auth.isAuthenticated()) {
  //     console.log('Paso el guard');
  //     // aqui deberia igualar los datos del usuario del login con la bd del sistema
  //     return true;
  //   } else {
  //     console.log('Bloqueado por el guard');
  //     return false;
  //   }
  // }

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): boolean {
    console.log('dentro del guard');
    let url: string = state.url;
    return this.checkLogin(url);
    /*if (this.auth.getUserLoggedIn()) {
      this.router.navigate(["empresa"]);
      console.log("Paso el guard");
    } else {
      this.router.navigate(["/"]);
      console.log("You are not authentication");
    }*/
    // return this.auth.getUserLoggedIn();
  }

  canLoad(route: Route): boolean {
    let url = `/${route.path}`;
    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      return this.canActivate(route, state);
  }

  checkLogin(url: string): boolean {
    if (this.authService.hayToken()) {
        return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}
