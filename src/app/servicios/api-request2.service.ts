import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response,
          Request, RequestOptions,
          URLSearchParams, RequestMethod
        } from '@angular/http';
import {HttpClient, HttpEventType} from '@angular/common/http';
import { Router } from '@angular/router';

import { AppConfig } from '../app-config';
import { throwError } from 'rxjs'
 throwError(new Error("oops"));

import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { FileItem } from '../entidades/file-item';


export interface ObjetoJWT {
  userId: string;
  token: string;
}

@Injectable()
export class ApiRequest2Service {
  headers = new Headers();
  private usuarioActualKey = 'currentUser'; // : string

  constructor(
    private _http: Http,
    private http: HttpClient,
    private router: Router,
    private appConfig: AppConfig
  ) {
  }

  appendAuthHeader(): Headers {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    // Este codigo me sirve el ingreso del sistema validando si se ingreso con el usuario y password
    // caso contrario no me ingresa al sistema (token del navegador)
    /* const objJWT: ObjetoJWT = JSON.parse(localStorage.getItem(this.usuarioActualKey));
    if (objJWT !== null) {
        const token = objJWT.token;
        if (token !== null) {
           this.headers.append('Authorization', token);
        }
    }*/
    return this.headers;
  }

  // funcion get (retorna una fila o todas de la tabla dependiendo del url)
  /*get(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._http.get(this.appConfig.baseApiPath + url, {
        headers: this.appendAuthHeader()
      }).map((res: Response) => res.json()).subscribe(
        (res) => {
          resolve(res);
        },
        (error) => {
          reject(error);
          this.handleError(error);
        }
      );
    });
  }*/

  // ejemplo --
  get2(url: string): Promise<any> {
    return this._http.get(this.appConfig.baseApiPath + url, {
      headers: this.appendAuthHeader()
    }).toPromise()
    .then(resp => resp.json())
    .catch(err => this.handleError(err));
  }

  // funcion create
  // post(url: string, objeto: Object): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this._http.post(this.appConfig.baseApiPath + url, objeto, {
  //         headers: this.appendAuthHeader()
  //     }).map((res: Response) => res.json()).subscribe(
  //       (res) => {
  //       resolve(res);
  //     },
  //       (error) => {
  //         reject(error);
  //         this.handleError(error);
  //       }
  //     );
  //   });
  // }

  // ejemplo--
  post2(url: string, objeto: Object): Promise<any> {
    return this._http.post(this.appConfig.baseApiPath + url, objeto, {
      headers: this.appendAuthHeader()
    }).toPromise()
    .then(resp => resp.json())
    .catch(err => this.handleError(err));
  }

  // function editar
  // put(url: string, objeto: Object): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this._http.put(this.appConfig.baseApiPath + url, objeto, {
  //         headers: this.appendAuthHeader()
  //     }).map((res: Response) => res.json()).subscribe(
  //       (res) => {
  //         resolve(res);
  //       },
  //       (error) => {
  //         reject(error);
  //         this.handleError(error);
  //       }
  //     );
  //   });
  // }

  // ejemplo --
  put2(url: string, objeto: Object): Promise<any> {
    return this._http.put(this.appConfig.baseApiPath + url, objeto, {
      headers: this.appendAuthHeader()
    }).toPromise()
    .then(resp => resp.json())
    .catch(err => this.handleError(err));
  }

  // funcion eliminar
  // delete(url: string): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this._http.delete(this.appConfig.baseApiPath + url, {
  //         headers: this.appendAuthHeader()
  //     }).map((res: Response) => res.json()).subscribe(
  //       (res) => {
  //         resolve(res);
  //       },
  //       (error) => {
  //         reject(error);
  //         this.handleError(error);
  //       }
  //     );
  //   });
  // }

  // ejemplo --
  delete2(url: string): Promise<any> {
    return this._http.delete(this.appConfig.baseApiPath + url, {
      headers: this.appendAuthHeader()
    }).toPromise()
    .then(resp => resp.json())
    .catch(err => this.handleError(err));
  }

  // Subir Imagenes
  onUpload(file: File, archivo: FileItem) {
    let exito: Boolean = false;
    const fd = new FormData();
    fd.append('image', file, file.name);
    this.http.post('https://us-central1-inmobiliaria-dd0b7.cloudfunctions.net/uploadFile', fd, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          archivo.progreso = Math.round(event.loaded / event.total * 100);
          console.log('Upload Progress: ' + archivo.progreso + '%');
        } else if (event.type === HttpEventType.Response) {
          console.log(event);
          exito = true;
        }
      }
    );
    return exito;
  }

  handleError(error: any): Promise<any> {
    if (error.status === 401 || error.status === 403) {
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['login']);
    }
    if (error.status === 404) {
      console.error('página solicitada no se encuentra');
    }
    return Promise.reject(error.message || error);
  }
}
