export class UsuarioTO {
    id: number;
    name: string = "";
    email: string = "";
    foto: string = null;
    estado: boolean = true;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.name = data.name ? data.name : this.name;
        this.email = data.email ? data.email : this.email;
        this.foto = data.foto ? data.foto : this.foto;
        this.estado = data.estado ? data.estado : this.estado;
    }
}