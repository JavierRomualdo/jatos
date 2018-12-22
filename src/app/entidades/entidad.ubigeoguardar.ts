import { Ubigeo } from './entidad.ubigeo';
import { Rangoprecios } from './entidadad.rangoprecios';

export class UbigeoGuardar {
  departamento: Ubigeo = null;
  provincia: Ubigeo = null;
  distrito: Ubigeo = new Ubigeo();
  ubigeo: Ubigeo = new Ubigeo();
  rangoprecio: Rangoprecios = new Rangoprecios();
  tiposervicio ?: String[] = [];// ya no va
  contrato ?: String[] = [];
  propiedad ?: String;
  servicios: number[] = [];

  constructor(data?) {
    data ? this.hydrate(data) : null;
  }

  hydrate(data) {
    this.departamento = data.departamento ? data.departamento : this.departamento;
    this.provincia = data.provincia ? data.provincia : this.provincia;
    this.distrito = data.distrito ? data.distrito : this.distrito;
    this.ubigeo = data.ubigeo ? data.ubigeo : this.ubigeo;
    this.rangoprecio = data.rangoprecio ? data.rangoprecio : this.rangoprecio;
    this.tiposervicio = data.tiposervicio ? data.tiposervicio : this.tiposervicio;
    this.contrato = data.contrato ? data.contrato : this.contrato;
    this.servicios = data.servicios ? data.servicios : this.servicios;
  }
}
