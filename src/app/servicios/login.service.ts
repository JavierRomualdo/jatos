import { Injectable } from '@angular/core';
import { Users } from '../entidades/entidad.users';
@Injectable()
/*{
  providedIn: 'root'
}
*/
export class LoginService {

  private isUserLoggedIn;
  private usuario: Users;
  public username;
  // public usuario: any = {};
  // constructor(public afAuth: AngularFireAuth) { //public api: ApiRequest2Service
  //   this.afAuth.authState.subscribe(user => {
  //     console.log('Estado del usuario: ', user);
  //     this.usuario = user;
  //     if (!user) {
  //       return;
  //     }
  //     this.usuario = {};
  //     // aqui comprobar el usuario ingresado con dlos datos del usuario de la bd
  //     this.usuario.nombre = user.displayName;
  //     this.usuario.email = user.email;
  //     this.usuario.uid = user.uid;
  //   });
  // }

  constructor() {
    this.isUserLoggedIn = false;
  }

  setUserLoggedIn(usuario: Users, estado: boolean) {
    this.isUserLoggedIn = estado;
    this.usuario = usuario;
    this.username = 'admin';
  }

  getUserLoggedIn() {
    console.log(this.isUserLoggedIn);
    return this.isUserLoggedIn;
  }

  cerrarSesion() {
    this.isUserLoggedIn = false;
    this.usuario = null;
  }

  

  // login(proveedor: string) {
  //   this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  // }
  // logout() {
  //   this.afAuth.auth.signOut();
  // }

  // isAuthenticated() {
  //   const hayauth: boolean = !this.usuario ? false : true;
  //   return hayauth;
  // }
}
