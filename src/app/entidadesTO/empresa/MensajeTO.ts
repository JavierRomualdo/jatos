export class MensajeTO {
    id: number;
    nombres: string = "";
    telefono: string = "";
    email: string = "";
    titulo: string = "";
    mensaje: string = "";
    estado: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.nombres = data.nombres ? data.nombres : this.nombres;
        this.telefono = data.telefono ? data.telefono : this.telefono;
        this.email = data.email ? data.email : this.email;
        this.titulo = data.titulo ? data.titulo : this.titulo;
        this.mensaje = data.mensaje ? data.mensaje : this.mensaje;
        this.estado = data.estado ? data.estado : this.estado;
    }
}