export class CasaArchivo {
    id: number;
    casa_id: number;
    nombre: string;
    archivo: string;
    tipoarchivo: string;
    estado: boolean = true;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.casa_id = data.casa_id ? data.casa_id : this.casa_id;
        this.nombre = data.nombre ? data.nombre : this.nombre;
        this.archivo = data.archivo ? data.archivo : this.archivo;
        this.tipoarchivo = data.tipoarchivo ? data.tipoarchivo : this.tipoarchivo;
        this.estado = data.estado ? data.estado : this.estado;
    }
}
