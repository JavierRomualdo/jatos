import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataUpdateService {
  // aca van los datos a aactualizar en el momento
  fotoPerfil: string = null;
  constructor() {
    console.log('Servicio inicializado');
  }

  setFotoPerfil(fotoPerfil: string) {
    this.fotoPerfil = fotoPerfil;
  }
}
