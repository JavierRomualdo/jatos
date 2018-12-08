import { Ubigeo } from './entidad.ubigeo';

export class Empresa {
  id: number;
  nombre: string;
  ruc: string;
  ubigeo_id: Ubigeo;
  direccion: string;
  telefono: string;
  correo: string;
  nombrefoto: string = null;
  foto: string = null;
  // tslint:disable-next-line:no-inferrable-types
  estado: boolean = true;
  // fotos: Blob[];
}
