import { Persona } from './entidad.persona';
import { Ubigeo } from './entidad.ubigeo';

export class Local {
    id: number;
    persona_id: Persona;
    ubigeo_id: Ubigeo;
    precio: number;
    largo: number;
    ancho: number;
    direccion: string;
    // tslint:disable-next-line:no-inferrable-types
    nmensajes: number = 0;
    tbanio: Boolean = false;
    descripcion: string;
    foto: string = null;
    path: string = null; // camino o ruta de imagenes en cloud storage de firebase
    // foto: Blob;
    // fotos: Blob[];
    tiposervicio: string;
    estado: Boolean = true;
    localpersonaList: any = {};
    fotosList: any = {};
    serviciosList: any = {};
    localservicioList: any = {};
}
