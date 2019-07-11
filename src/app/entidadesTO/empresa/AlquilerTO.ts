export class AlquilerTO {
    id: number;
    estadocontrato: string = ""; // L V A R
    foto: string = null;
    propiedad_id: number;
    propiedad_codigo: string;
    cliente: string = "";
    propietario: string = "";
    siglas: string = "";
    ubicacion: string = "";// propiedad
    direccion: string = ""; // propiedad
    preciocontrato: number;
    fechadesde: string = ""; // fechaVenta
    fechahasta: string = "";
    
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
        this.siglas = data.siglas ? data.siglas : this.siglas;
        this.ubicacion = data.ubicacion ? data.ubicacion : this.ubicacion;
        this.direccion = data.direccion ? data.direccion : this.direccion;
        this.preciocontrato = data.preciocontrato ? data.preciocontrato : this.preciocontrato;
        this.fechadesde = data.fechadesde ? data.fechadesde : this.fechadesde;
        this.fechahasta = data.fechahasta ? data.fechahasta : this.fechahasta;
    }
}