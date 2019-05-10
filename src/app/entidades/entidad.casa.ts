import { Persona } from './entidad.persona';
import { Ubigeo } from './entidad.ubigeo';
import { HabilitacionUrbana } from './entidad.habilitacionurbana';

export class Casa {
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
  npisos: number = 0;
  ncuartos: number = 0;
  nbanios: number = 0;
  tjardin: boolean = false;
  tcochera: boolean = false;
  referencia: string = null;
  descripcion: string = null;
  foto: string = null;
  path: string = null; // camino o ruta de imagenes en cloud storage de firebase
  pathArchivos: string = null; // camino o ruta de archivos en cloud storage de firebase
  // foto: Blob;
  // fotos: Blob [];
  // tslint:disable-next-line:no-inferrable-types
  nmensajes: number = 0;
  contrato: string;
  estadocontrato: string = 'L';
  estado: boolean = true;
  casapersonaList: any = {};
  fotosList: any = {};
  archivosList: any = {};
  serviciosList: any = {};
  casaservicioList: any = {};
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
    this.npisos = data.npisos ? data.npisos : this.npisos;
    this.ncuartos = data.ncuartos ? data.ncuartos : this.ncuartos;
    this.nbanios = data.nbanios ? data.nbanios : this.nbanios;
    this.tjardin = data.tjardin ? data.tjardin : this.tjardin;
    this.tcochera = data.tcochera ? data.tcochera : this.tcochera;
    this.referencia = data.referencia ? data.referencia : this.referencia;
    this.descripcion = data.descripcion ? data.descripcion : this.descripcion;
    this.foto = data.foto ? data.foto : this.foto;
    this.path = data.path ? data.path : this.path;
    this.pathArchivos = data.pathArchivos ? data.pathArchivos : this.pathArchivos;
    this.nmensajes = data.nmensajes ? data.nmensajes : this.nmensajes;
    this.contrato = data.contrato ? data.contrato : this.contrato;
    this.estadocontrato = data.estadocontrato ? data.estadocontrato : this.estadocontrato;
    this.estado = data.estado ? data.estado : this.estado;
    this.casapersonaList = data.casapersonaList ? data.casapersonaList : this.casapersonaList;
    this.fotosList = data.fotosList ? data.fotosList : this.fotosList;
    this.archivosList = data.archivosList ? data.archivosList : this.archivosList;
    this.serviciosList = data.serviciosList ? data.serviciosList : this.serviciosList;
    this.casaservicioList = data.casaservicioList ? data.casaservicioList : this.casaservicioList;
    this.latitud = data.latitud ? data.latitud : this.latitud;
    this.longitud = data.longitud ? data.longitud : this.longitud;
  }
}
