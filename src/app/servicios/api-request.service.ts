import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response,
          Request, RequestOptions,
          URLSearchParams, RequestMethod
        } from '@angular/http';
import { Router } from '@angular/router';

import { AppConfig } from '../app-config';


import 'rxjs/add/operator/toPromise';
// import Http en modelu.ts
export interface ObjetoJWT {
  userId: string;
  token: string;
}

@Injectable()
export class ApiRequestService {

  private headers: Headers;
  private requestOptions: RequestOptions;
  private usuarioActualKey = 'currentUser'; // : string

  constructor(
    private appConfig: AppConfig,
    private http: Http,
    private router: Router,
  ) { }

  appendAuthHeader(): Headers {
    // this.headers = new Headers();
    // this.headers.append('Content-Type', 'application/json');
    // this.headers.append('Authorization', 'add_your_token_here');
    // this.headers.append('Access-Control-Allow-Origin', '*');

    this.headers = new Headers({ 'Content-Type': 'application/json' });
    const objJWT: ObjetoJWT = JSON.parse(localStorage.getItem(this.usuarioActualKey));
    if (objJWT !== null) {
        const token = objJWT.token;
        if (token !== null) {
           this.headers.append('Authorization', token);
        }
    }
    return this.headers;
  }

  getRequestOptions(requestMethod, url: string, urlParam?: URLSearchParams, body?: Object): RequestOptions {
    let options = new RequestOptions({
        headers: this.appendAuthHeader(),
        method: requestMethod,
        url: this.appConfig.baseApiPath + url
    });
    if (urlParam) {
      console.log('params');
        options = options.merge({ params: urlParam });
    }
    if (body) {
      console.log('body');
        options = options.merge({ body: JSON.stringify(body) });
    }
    return options;
  }

  get(url: string, urlParams?: URLSearchParams): Promise<any> {
    const requestOptions = this.getRequestOptions(RequestMethod.Get, url, urlParams);
    return this.http.request(new Request(requestOptions))
        .toPromise()
        .then(resp => resp.json())
        .catch(err => this.handleError(err));
  }

  post(url: string, body: Object): Promise<any> {
    const requestOptions = this.getRequestOptions(RequestMethod.Post, url, undefined, body);
    return this.http.request(new Request(requestOptions))
        .toPromise()
        .then(resp => resp.json())
        .catch(err => this.handleError(err));
  }

  put(url: string, body: Object): Promise<any> {
    const requestOptions = this.getRequestOptions(RequestMethod.Put, url, undefined, body);
    return this.http.request(new Request(requestOptions))
        .toPromise()
        .then(resp => resp.json())
        .catch(err => this.handleError(err));
  }

  delete(url: string): Promise<any> {
    const requestOptions = this.getRequestOptions(RequestMethod.Delete, url);
    return this.http.request(new Request(requestOptions))
      .toPromise()
      .then(resp => resp.json())
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
