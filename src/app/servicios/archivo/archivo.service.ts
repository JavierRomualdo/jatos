import { Injectable } from '@angular/core';
import { Http, Headers, Response,
  Request, RequestOptions,
  URLSearchParams, RequestMethod, ResponseContentType
} from '@angular/http';
import {HttpClient, HttpEventType} from '@angular/common/http';
import { Router } from '@angular/router';

import { throwError } from 'rxjs'
throwError(new Error("oops"));

import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { AppConfig } from 'src/app/app-config';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  private responseContentType: ResponseContentType;
  headers = new Headers();

  constructor(
    private http: Http,
    private router: Router,
    private appConfig: AppConfig
  ) {
    this.responseContentType = ResponseContentType.ArrayBuffer;
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

  // postExcel(url: string): Promise<any> {
  //   return this.http.get(this.appConfig.baseApiPath + url, {
  //     headers: this.appendAuthHeader()
  //   }).toPromise()
  //   .catch(err => this.handleError(err));
  // }

  postPdf(url: string, objeto: Object): Promise<any> {
    return this.http.post(this.appConfig.baseApiPath + url, objeto, {
      responseType: this.responseContentType,
      headers: this.appendAuthHeader()
    }).toPromise()
    .catch(err => this.handleError(err));
  }

  postExcel(url: string, objeto: Object): Promise<any> {
    return this.http.post(this.appConfig.baseApiPath + url, objeto, {
      responseType: this.responseContentType,
      headers: this.appendAuthHeader()
    }).toPromise()
    .catch(err => this.handleError(err));
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
