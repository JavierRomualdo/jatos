import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataUpdateService {
  // aca van los datos a aactualizar en el momento
  private fotoPerfil = new Subject<string>();
  constructor() {
    console.log('Servicio inicializado');
  }

  setFotoPerfil(fotoPerfil: string) {
    this.fotoPerfil.next(fotoPerfil);
  }

  getFotoPerfil() {
    return this.fotoPerfil;
  }
}
