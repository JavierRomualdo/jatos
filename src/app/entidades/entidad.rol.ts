export class Rol {
  id?: number;
  rol: string = "";
  permiso: string = null;
  estado: boolean = true;

  constructor(data?) {
    data ? this.hydrate(data) : null;
  }

  hydrate(data) {
    this.rol = data.rol ? data.rol : this.rol;
    this.permiso = data.permiso ? data.permiso : this.permiso;
    this.estado = data.estado ? data.estado : this.estado;
  }
}
