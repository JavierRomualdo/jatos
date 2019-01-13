import { Persona } from './entidad.persona';
import { Ubigeo } from './entidad.ubigeo';

export class Cochera {
  id: number;
  persona_id: Persona = new Persona;
  ubigeo_id: Ubigeo = new Ubigeo();
  codigo: string = null;
  precioadquisicion: number = 0.00;
  preciocontrato: number = 0.00;
  ganancia: number = 0.00;
  largo: number;
  ancho: number;
  direccion: string;
  descripcion: string = null;
  foto: string = null;
  path: string = null; // camino o ruta de imagenes en cloud storage de firebase
  // tslint:disable-next-line:no-inferrable-types
  nmensajes: number = 0;
  contrato: string;
  estadocontrato: string = 'L';
  // foto: Blob;
  // fotos: Blob [];
  // tslint:disable-next-line:no-inferrable-types
  estado: Boolean = true;
  cocherapersonaList: any = {};
  fotosList: any = {};
  serviciosList: any = {};
  cocheraservicioList: any = {};
  latitud: string = "";
  longitud: string = "";
}
