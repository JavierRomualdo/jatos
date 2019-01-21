import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiRequest2Service } from './api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from './util/util.service';
import { Subject, Observable } from 'rxjs';
import { LS } from '../contantes/app-constants';

export interface AuthSolicitudParam {
  name: string; // username
  password: string;
}

export interface ObjetoJWT {
  userId: string;
  token: string;
  nombrecompleto: string;
  codigo: string;
  name: string;
}

@Injectable()
export class AuthService {

  private isLogged$ = new Subject<boolean>();
  
  constructor(
    private router: Router,
    private api: ApiRequest2Service,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  agregarmodalopenclass(): void {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('modal-open');
    body.classList.add('modal-open');
  }

  ingresar(name: string, password: string) {
    let bodyData: AuthSolicitudParam = {
        'name': name,
        'password': password
    };
    this.api.login('session', bodyData).then(
      (data) => {
        if (data && data.extraInfo && data.estadoOperacion === "EXITO") {
          let user = {
            "userId": data.extraInfo.usuario.id, //usuarioId
            "token": data.extraInfo.usuario.remember_token, //token
            "nombrecompleto": data.extraInfo.usuario.name, //nombrecompleto
            "codigo": data.extraInfo.usuario.codigo,
            "name": data.extraInfo.usuario.name
          };
          localStorage.setItem(LS.KEY_CURRENT_USER, JSON.stringify(user));
          localStorage.setItem(LS.KEY_FOTO_PERFIL, JSON.stringify(data.extraInfo.usuario.foto));
          localStorage.setItem(LS.KEY_NOTIFICACIONES, JSON.stringify(data.extraInfo.notificacionDto));
          this.isLogged$.next(true);
        } else {
          this.toastr.error(data.operacionMensaje, LS.TOAST_ERROR);
          this.cerrarSession();
          this.isLogged$.next(false);
        }
      }
    ).catch(err => {
      this.isLogged$.next(false);
      this.utilService.handleError(err, this);
    });
  }

  getIsLogged$(): Observable<boolean> {
    return this.isLogged$.asObservable();
  }

  cerrarSession(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(["/login"]);/* ir al backend y caducar token */
  }

  getObjetoJWT(): ObjetoJWT {
    let dataJWT: string = localStorage.getItem(LS.KEY_CURRENT_USER);
    if (dataJWT) {
        let objJWT: ObjetoJWT = JSON.parse(localStorage.getItem(LS.KEY_CURRENT_USER));
        return objJWT;
    } else {
        return null;
    }
  };

  hayToken(): boolean {
    let objJWT: ObjetoJWT = this.getObjetoJWT();
    if (objJWT !== null) {
        return true;
    } else {
        return false;
    }
  };
}
