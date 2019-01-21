export class PersonaTO {
    id: number;//
    nombres: string = "";
    dni: string = "";
    ubicacion: string = "";//
    direccion: string = "";
    telefono: string = "";
    correo: string = "";
    rol: string = "";
    estado: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.nombres = data.nombres ? data.nombres : this.nombres;
        this.dni = data.dni ? data.dni : this.dni;
        this.ubicacion = data.ubicacion ? data.ubicacion : this.ubicacion;
        this.direccion = data.direccion ? data.direccion : this.direccion;
        this.telefono = data.telefono ? data.telefono : this.telefono;
        this.correo = data.correo ? data.correo : this.correo;
        this.rol = data.rol ? data.rol : this.rol;
        this.estado = data.estado ? data.estado : this.estado;
    }
}