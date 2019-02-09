import { Persona } from './entidad.persona';
import { Ubigeo } from './entidad.ubigeo';

export class Local {
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
    // tslint:disable-next-line:no-inferrable-types
    nmensajes: number = 0;
    tbanio: Boolean = false;
    referencia: string = null;
    descripcion: string = null;
    foto: string = null;
    path: string = null; // camino o ruta de imagenes en cloud storage de firebase
    // foto: Blob;
    // fotos: Blob[];
    contrato: string;
    estadocontrato: string = 'L';
    estado: Boolean = true;
    localpersonaList: any = {};
    fotosList: any = {};
    serviciosList: any = {};
    localservicioList: any = {};
    latitud: string = "";
    longitud: string = "";
}
