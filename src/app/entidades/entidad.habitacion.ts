import { Persona } from './entidad.persona';
import { Ubigeo } from './entidad.ubigeo';

export class Habitacion {
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
  ncamas: number = 0;
  nmensajes: number = 0;
  tbanio: Boolean = false;
  referencia: string = null;
  descripcion: string = null;
  foto: string = null;
  path: string = null; // camino o ruta de imagenes en cloud storage de firebase
  // fotos: Blob [];
  contrato: string;
  estadocontrato: string = 'L';
  estado: boolean = true;
  habitacionpersonaList: any = {};
  fotosList: any = {};
  serviciosList: any = {};
  habitacionservicioList: any = {};
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
    this.direccion = data.direccion ? data.direccion : this.direccion;
    this.ncamas = data.ncamas ? data.ncamas : this.ncamas;
    this.tbanio = data.tbanio ? data.tbanio : this.tbanio;
    this.referencia = data.referencia ? data.referencia : this.referencia;
    this.descripcion = data.descripcion ? data.descripcion : this.descripcion;
    this.foto = data.foto ? data.foto : this.foto;
    this.path = data.path ? data.path : this.path;
    this.nmensajes = data.nmensajes ? data.nmensajes : this.nmensajes;
    this.contrato = data.contrato ? data.contrato : this.contrato;
    this.estadocontrato = data.estadocontrato ? data.estadocontrato : this.estadocontrato;
    this.estado = data.estado ? data.estado : this.estado;
    this.habitacionpersonaList = data.habitacionpersonaList ? data.habitacionpersonaList : this.habitacionpersonaList;
    this.fotosList = data.fotosList ? data.fotosList : this.fotosList;
    this.serviciosList = data.serviciosList ? data.serviciosList : this.serviciosList;
    this.habitacionservicioList = data.habitacionservicioList ? data.habitacionservicioList : this.habitacionservicioList;
  }
}
