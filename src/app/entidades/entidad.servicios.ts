export class Servicios {
  id: number;
  servicio: string = "";
  detalle: string = null;
  estado: boolean = true;

  constructor(data?) {
    data ? this.hydrate(data) : null;
  }

  hydrate(data) {
    this.servicio = data.servicio ? data.servicio : this.servicio;
    this.detalle = data.detalle ? data.detalle : this.detalle;
    this.estado = data.estado ? data.estado : this.estado;
  }
}
