import { Apartamento } from './entidad.apartamento';
import { Persona } from './entidad.persona';

export class ApartamentoCuarto {
  id: number;
  persona_id: Persona;
  apartamento_id: Apartamento;
  precio: number;
  largo: number;
  ancho: number;
  piso: number;
  // tslint:disable-next-line:no-inferrable-types
  nbanios: number = 0;
  direccion: string;
  descripcion: string = null;
  foto: string = null;
  path: string = null; // camino o ruta de imagenes en cloud storage de firebase
  // foto: Blob;
  // fotos: Blob [];
  // tslint:disable-next-line:no-inferrable-types
  nmensajes: number = 0;
  estado: Boolean = true;
  cocherapersonaList: any = {};
  fotosList: any = {};
  serviciosList: any = {};
  cocheraservicioList: any = {};
}
