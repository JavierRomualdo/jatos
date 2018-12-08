import { Persona } from './entidad.persona';
import { Ubigeo } from './entidad.ubigeo';

export class Cochera {
  id: number;
  persona_id: Persona;
  ubigeo_id: Ubigeo;
  precio: number;
  largo: number;
  ancho: number;
  direccion: string;
  descripcion: string = null;
  foto: string = null;
  path: string = null; // camino o ruta de imagenes en cloud storage de firebase
  // tslint:disable-next-line:no-inferrable-types
  nmensajes: number = 0;
  // foto: Blob;
  // fotos: Blob [];
  // tslint:disable-next-line:no-inferrable-types
  tiposervicio: string;
  estado: Boolean = true;
  cocherapersonaList: any = {};
  fotosList: any = {};
  serviciosList: any = {};
  cocheraservicioList: any = {};
}
