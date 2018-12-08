import { Persona } from './entidad.persona';
import { Ubigeo } from './entidad.ubigeo';

export class Casa {
  id: number;
  persona_id: Persona;
  ubigeo_id: Ubigeo;
  precio: number;
  largo: number;
  ancho: number;
  direccion: string;
  npisos: number = 0;
  ncuartos: number = 0;
  nbanios: number = 0;
  tjardin: boolean = false;
  tcochera: boolean = false;
  descripcion: string = null;
  foto: string = null;
  path: string = null; // camino o ruta de imagenes en cloud storage de firebase
  // foto: Blob;
  // fotos: Blob [];
  // tslint:disable-next-line:no-inferrable-types
  nmensajes: number = 0;
  tiposervicio: string;
  estado: boolean = true;
  casapersonaList: any = {};
  fotosList: any = {};
  serviciosList: any = {};
  casaservicioList: any = {};
}
