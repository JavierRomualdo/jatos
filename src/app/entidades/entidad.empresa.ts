import { Ubigeo } from './entidad.ubigeo';

export class Empresa {
  id: number;
  nombre: string = "";
  ruc: string = "";
  ubigeo_id: Ubigeo = new Ubigeo();
  direccion: string = "";
  telefono: string = "";
  correo: string = "";
  nombrefoto: string = null;
  foto: string = null;
  // tslint:disable-next-line:no-inferrable-types
  estado: boolean = true;
  // fotos: Blob[];
  latitud: string = "";
  longitud: string = "";

  constructor(data?) {
    data ? this.hydrate(data) : null;
  }

  hydrate(data) {
    this.id = data.id ? data.id : this.id;
    this.nombre = data.nombre ? data.nombre : this.nombre;
    this.ruc = data.ruc ? data.ruc : this.ruc;
    this.ubigeo_id = data.ubigeo_id ? data.ubigeo_id : this.ubigeo_id;
    this.direccion = data.direccion ? data.direccion : this.direccion;
    this.telefono = data.telefono ? data.telefono : this.telefono;
    this.correo = data.correo ? data.correo : this.correo;
    this.nombrefoto = data.nombrefoto ? data.nombrefoto : this.nombrefoto;
    this.foto = data.foto ? data.foto : this.foto;
    this.estado = data.estado ? data.estado : this.estado;
    this.latitud = data.latitud ? data.latitud : this.latitud;
    this.longitud = data.longitud ? data.longitud : this.longitud;
  }
}
