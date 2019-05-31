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
    nombrehabilitacionurbana: string;
    direccion: string;
    // tslint:disable-next-line:no-inferrable-types
    nmensajes: number = 0;
    tbanio: Boolean = false;
    referencia: string = null;
    descripcion: string = null;
    foto: string = null;
    path: string = null; // camino o ruta de imagenes en cloud storage de firebase
    pathArchivos: string = null; // camino o ruta de archivos en cloud storage de firebase
    // foto: Blob;
    // fotos: Blob[];
    contrato: string;
    estadocontrato: string = 'L';
    estado: Boolean = true;
    localpersonaList: any = {};
    fotosList = [];
    archivosList = [];
    serviciosList: any = {};
    localservicioList: any = {};
    latitud: string = "";
    longitud: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
      }
    
      hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.persona_id = data.persona_id ? data.persona_id : this.persona_id;
        this.ubigeo_id = data.ubigeo_id ? data.ubigeo_id : this.ubigeo_id;
        this.codigo = data.codigo ? data.codigo : this.codigo;
        this.precioadquisicion = data.precioadquisicion ? data.precioadquisicion : this.precioadquisicion;
        this.preciocontrato = data.preciocontrato ? data.preciocontrato : this.preciocontrato;
        this.ganancia = data.ganancia ? data.ganancia : this.ganancia;
        this.largo = data.largo ? data.largo : this.largo;
        this.ancho = data.ancho ? data.ancho : this.ancho;
        this.nombrehabilitacionurbana = data.nombrehabilitacionurbana ? data.nombrehabilitacionurbana : this.nombrehabilitacionurbana;
        this.direccion = data.direccion ? data.direccion : this.direccion;
        this.referencia = data.referencia ? data.referencia : this.referencia;
        this.descripcion = data.descripcion ? data.descripcion : this.descripcion;
        this.foto = data.foto ? data.foto : this.foto;
        this.path = data.path ? data.path : this.path;
        this.pathArchivos = data.pathArchivos ? data.pathArchivos : this.pathArchivos;
        this.nmensajes = data.nmensajes ? data.nmensajes : this.nmensajes;
        this.contrato = data.contrato ? data.contrato : this.contrato;
        this.estadocontrato = data.estadocontrato ? data.estadocontrato : this.estadocontrato;
        this.estado = data.estado ? data.estado : this.estado;
        this.tbanio = data.tbanio ? data.tbanio : this.tbanio;
        this.fotosList = data.fotosList ? data.fotosList : this.fotosList;
        this.archivosList = data.archivosList ? data.archivosList : this.archivosList;
        this.serviciosList = data.serviciosList ? data.serviciosList : this.serviciosList;
        this.localpersonaList = data.localpersonaList ? data.localpersonaList : this.localpersonaList;
        this.localservicioList = data.localservicioList ? data.localservicioList : this.localservicioList;
        this.latitud = data.latitud ? data.latitud : this.latitud;
        this.longitud = data.longitud ? data.longitud : this.longitud;
      }
}
