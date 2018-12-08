import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/entidades/entidad.users';
import { LoginService } from 'src/app/servicios/login.service';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public usuario: Users;
  public cargando: Boolean = false;
  constructor(
    private loginservicio: LoginService,
    private api: ApiRequest2Service,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuario = new Users();
  }

  ingresar() {
    console.log(this.usuario);
    if (this.usuario) {
      console.log("paso al if");
      this.api
        .post2("iniciarSesion", this.usuario)
        .then(
          res => {
            console.log("resultado: ");
            console.log(res);
            if (res) {
              this.usuario = res;
              this.router.navigate(["empresa"]);
              console.log("Paso el guard login component");
              this.loginservicio.setUserLoggedIn(this.usuario, true);
              this.loginservicio.getUserLoggedIn();
            } else {
              console.log("no paso nada");
              this.loginservicio.setUserLoggedIn(null, false);
              this.loginservicio.getUserLoggedIn();
            }
            this.cargando = false;
          },
          error => {
            if (error.status === 422) {
              // .errors = [];
              const errors = error.json();
              console.log("Error");
              // this.cargando = false;
              /*for (const key in errors) {
            this.errors.push(errors[key]);
          }*/
            }
          }
        )
        .catch(err => this.handleError(err));
    }
    // this.loginservicio.login('javier');
  }

  salir() {
    // this.loginservicio.logout();
    this.loginservicio.setUserLoggedIn(null, false);
  }

  nuevoUsuario() {
    this.cargando = true;
    this.api
      .post2("usuarios", this.usuario)
      .then(
        res => {
          console.log("usuario registrado: ");
          console.log(res);
          if (res) {
            this.usuario = res;
            this.loginservicio.setUserLoggedIn(this.usuario, true);
            this.loginservicio.getUserLoggedIn();
          } else {
            console.log("nada no entro ");
            this.loginservicio.setUserLoggedIn(null, false);
            this.loginservicio.getUserLoggedIn();
          }
          this.cargando = false;
        },
        error => {
          if (error.status === 422) {
            // .errors = [];
            const errors = error.json();
            console.log("Error");
            // this.cargando = false;
            /*for (const key in errors) {
            this.errors.push(errors[key]);
          }*/
          }
        }
      )
      .catch(err => this.handleError(err));
  }

  private handleError(error: any): void {
    this.cargando = false;
  }

}
