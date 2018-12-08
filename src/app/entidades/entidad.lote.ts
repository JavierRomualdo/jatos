import { Persona } from './entidad.persona';
import { Ubigeo } from './entidad.ubigeo';

export class Lote {
    id: number;
    persona_id: Persona;
    ubigeo_id: Ubigeo;
    precio: number;
    largo: number;
    ancho: number;
    nmensajes: number = 0;
    direccion: string;
    descripcion: string = null;
    foto: string = null;
    path: string = null; // camino o ruta de imagenes en cloud storage de firebase
    // fotos: Blob[];
    tiposervicio: string;
    estado: boolean = true;
    lotepersonaList: any = {};
    fotosList: any = {};
}
