import { Injectable } from "@angular/core";
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate
} from "@angular/router";
import { LoginService } from "./login.service";
import { Observable } from "rxjs";
// import { AuthService } from './auth.service';

@Injectable({
  providedIn: "root"
})
export class AuthGuardService implements CanActivate {
  // implements CanActivate

  constructor(private auth: LoginService, private router: Router) {} // private auth: AuthService

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

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('dentro del guard');
    /*if (this.auth.getUserLoggedIn()) {
      this.router.navigate(["empresa"]);
      console.log("Paso el guard");
    } else {
      this.router.navigate(["/"]);
      console.log("You are not authentication");
    }*/
    return this.auth.getUserLoggedIn();
  }
}
