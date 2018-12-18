export class VentaTO {
    id: number;
    estadocontrato: string = ""; // L V A R
    foto: string = null;
    propiedad_id: number;
    propiedad_codigo: string;
    propietario: string = "";
    cliente: string = "";
    ubicacion: string = "";// casa
    direccion: string = ""; // casa
    precio: number;
    fechaVenta: Date;
    
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.estadocontrato = data.estadocontrato ? data.estadocontrato : this.estadocontrato;
        this.foto = data.foto ? data.foto : this.foto;
        this.propiedad_id = data.propiedad_id ? data.propiedad_id : this.propiedad_id;
        this.propiedad_codigo = data.propiedad_codigo ? data.propiedad_codigo : this.propiedad_codigo;
        this.cliente = data.cliente ? data.cliente : this.cliente;
        this.propietario = data.propietario ? data.propietario : this.propietario;
        this.ubicacion = data.ubicacion ? data.ubicacion : this.ubicacion;
        this.direccion = data.direccion ? data.direccion : this.direccion;
        this.precio = data.precio ? data.precio : this.precio;
        this.fechaVenta = data.fechaVenta ? data.fechaVenta : this.fechaVenta;
    }
}