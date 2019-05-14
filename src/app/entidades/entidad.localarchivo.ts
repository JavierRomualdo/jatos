export class LocalArchivo {
    id: number;
    local_id: number;
    nombre: string;
    archivo: string;
    tipoarchivo: string;
    estado: boolean = true;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.local_id = data.local_id ? data.local_id : this.local_id;
        this.nombre = data.nombre ? data.nombre : this.nombre;
        this.archivo = data.archivo ? data.archivo : this.archivo;
        this.tipoarchivo = data.tipoarchivo ? data.tipoarchivo : this.tipoarchivo;
        this.estado = data.estado ? data.estado : this.estado;
    }
}