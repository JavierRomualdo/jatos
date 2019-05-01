export class HabilitacionUrbana {
    id: number = null;
    nombre: string = "";
    siglas: string = "";
    estado: boolean = true;
  
    constructor(data?) {
      data ? this.hydrate(data) : null;
    }
  
    hydrate(data) {
      this.id = data.id ? data.id : this.id;
      this.nombre = data.nombre ? data.nombre : this.nombre;
      this.siglas = data.siglas ? data.siglas : this.siglas;
      this.estado = data.estado ? data.estado : this.estado;
    }
  }
  