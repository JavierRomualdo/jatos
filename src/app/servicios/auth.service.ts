import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  constructor() { }

  agregarmodalopenclass(): void {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('modal-open');
    body.classList.add('modal-open');
  }
}
