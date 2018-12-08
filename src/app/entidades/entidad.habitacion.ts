import { Persona } from './entidad.persona';
import { Ubigeo } from './entidad.ubigeo';

export class Habitacion {
  id: number;
  persona_id: Persona;
  ubigeo_id: Ubigeo;
  precio: number;
  largo: number;
  ancho: number;
  direccion: string;
  ncamas: number = 0;
  nmensajes: number = 0;
  tbanio: Boolean = false;
  descripcion: string = null;
  foto: string = null;
  path: string = null; // camino o ruta de imagenes en cloud storage de firebase
  // fotos: Blob [];
  tiposervicio: string;
  estado: boolean = true;
  habitacionpersonaList: any = {};
  fotosList: any = {};
  serviciosList: any = {};
  habitacionservicioList: any = {};
}
