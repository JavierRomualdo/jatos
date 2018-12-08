import { UbigeoTipo } from './entidad.tipoubigeo';

export class Ubigeo {
  id: number;
  tipoubigeo_id: UbigeoTipo = new UbigeoTipo();
  ubigeo: string = "";
  codigo: string = null;
  estado: boolean = true;

  constructor(data?) {
    data ? this.hydrate(data) : null;
  }

  hydrate(data) {
    this.tipoubigeo_id = data.tipoubigeo_id ? data.tipoubigeo_id : this.tipoubigeo_id;
    this.ubigeo = data.ubigeo ? data.ubigeo : this.ubigeo;
    this.codigo = data.codigo ? data.codigo : this.codigo;
    this.estado = data.estado ? data.estado : this.estado;
  }
}
