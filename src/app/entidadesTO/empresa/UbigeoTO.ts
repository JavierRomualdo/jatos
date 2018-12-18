export class UbigeoTO {
    id: number;
    codigo: string = "";
    tipoubigeo_id: number;
    ubigeo: string = ""; // por ejemplo: Piura
    estado: boolean = true;
  
    constructor(data?) {
      data ? this.hydrate(data) : null;
    }
  
    hydrate(data) {
      this.id = data.id ? data.id : this.id;
      this.codigo = data.codigo ? data.codigo : this.codigo;
      this.tipoubigeo_id = data.tipoubigeo_id ? data.tipoubigeo_id : this.tipoubigeo_id;
      this.ubigeo = data.ubigeo ? data.ubigeo : this.ubigeo;
      this.estado = data.estado ? data.estado : this.estado;
    }
  }
  