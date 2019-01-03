export class Alquiler {
    id: number;
    apartamento_id: number = null;
    casa_id: number = null;
    cochera_id: number = null;
    habitacion_id: number = null;
    local_id: number = null;
    lote_id: number = null;
    persona_id: number;
    fechadesde: string; // fecha de venta
    fechahasta: string; // fecha de venta
    estado: boolean = true;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.apartamento_id = data.apartamento_id ? data.apartamento_id : this.apartamento_id;
        this.casa_id = data.casa_id ? data.casa_id : this.casa_id;
        this.cochera_id = data.cochera_id ? data.cochera_id : this.cochera_id;
        this.habitacion_id = data.habitacion_id ? data.habitacion_id : this.habitacion_id;
        this.local_id = data.local_id ? data.local_id : this.local_id;
        this.lote_id = data.lote_id ? data.lote_id : this.lote_id;
        this.persona_id = data.persona_id ? data.persona_id : this.persona_id;
        this.fechadesde = data.fechadesde ? data.fechadesde : this.fechadesde;
        this.fechahasta = data.fechahasta ? data.fechahasta : this.fechahasta;
        this.estado = data.estado ? data.estado : this.estado;
    }
}