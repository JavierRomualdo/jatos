export class UbigeoTipo {
  id: number;
  tipoubigeo: string = "";
  estado: boolean = true;

  constructor(data?) {
    data ? this.hydrate(data) : null;
  }

  hydrate(data) {
    this.tipoubigeo = data.tipoubigeo ? data.tipoubigeo : this.tipoubigeo;
    this.estado = data.estado ? data.estado : this.estado;
  }
}
