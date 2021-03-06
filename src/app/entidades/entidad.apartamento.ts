import { Ubigeo } from './entidad.ubigeo';

export class Apartamento {
  id: number;
  ubigeo_id: Ubigeo = new Ubigeo();
  codigo: string = null;
  precioadquisicion: number = 0.00;
  preciocontrato: number = 0.00;
  ganancia: number = 0.00;
  largo: number;
  ancho: number;
  npisos: number;
  // tslint:disable-next-line:no-inferrable-types
  tcochera: boolean = false;
  direccion: string;
  descripcion: string = null;
  foto: string = null;
  path: string = null; // camino o ruta de imagenes en cloud storage de firebase
  // foto: Blob;
  // fotos: Blob [];
  // tslint:disable-next-line:no-inferrable-types
  nmensajes: number = 0;
  contrato: string;
  estadocontrato: string = 'L';
  estado: Boolean = true;
  fotosList: any = {};
  serviciosList: any = {};
  apartamentoservicioList: any = {};
}
