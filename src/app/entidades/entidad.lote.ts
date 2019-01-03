import { Persona } from './entidad.persona';
import { Ubigeo } from './entidad.ubigeo';

export class Lote {
    id: number;
    persona_id: Persona = new Persona;
    ubigeo_id: Ubigeo = new Ubigeo();
    codigo: string = null;
    precioadquisicion: number = 0.00;
    preciocontrato: number = 0.00;
    ganancia: number = 0.00;
    largo: number;
    ancho: number;
    nmensajes: number = 0;
    direccion: string;
    descripcion: string = null;
    foto: string = null;
    path: string = null; // camino o ruta de imagenes en cloud storage de firebase
    // fotos: Blob[];
    contrato: string;
    estadocontrato: string = 'L';
    estado: boolean = true;
    lotepersonaList: any = {};
    fotosList: any = {};
}
