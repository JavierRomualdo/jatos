import { Rol } from './entidad.rol';
import { Ubigeo } from './entidad.ubigeo';

export class Persona {
  id: number;
  rol_id: Rol = new Rol;
  ubigeo_id: Ubigeo = new Ubigeo();
  dni: string = "";
  nombres: string = "";
  correo: string = null;
  direccion: string = "";
  telefono: string = "";
  estado: Boolean = true;
  personarolList: any = {};

  constructor(data?) {
    data ? this.hydrate(data) : null;
  }

  hydrate(data) {
    this.rol_id = data.rol_id ? data.rol_id : this.rol_id;
    this.ubigeo_id = data.ubigeo_id ? data.ubigeo_id : this.ubigeo_id;
    this.dni = data.dni ? data.dni : this.dni;
    this.nombres = data.nombres ? data.nombres : this.nombres;
    this.correo = data.correo ? data.correo : this.correo;
    this.direccion = data.direccion ? data.direccion : this.direccion;
    this.telefono = data.telefono ? data.telefono : this.telefono;
    this.estado = data.estado ? data.estado : this.estado;
    this.personarolList = data.personarolList ? data.personarolList : this.personarolList;
  }
}
