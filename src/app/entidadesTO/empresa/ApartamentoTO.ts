export class ApartamentoTO {
    id: number;
    foto: string = null;
    ubicacion: string = "";//
    direccion: string = "";
    largo: number = 0;
    ancho: number = 0;
    codigo: string = "";
    preciocompra: number = 0.00;
    preciocontrato: number = 0.00;
    ganancia: number = 0.00;
    npisos: number = 0;
    tcochera: boolean = false;
    contrato: string = "";
    estadocontrato: string = 'L';
    estado: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.foto = data.foto ? data.foto : this.foto;
        this.ubicacion = data.ubicacion ? data.ubicacion : this.ubicacion;
        this.direccion = data.direccion ? data.direccion : this.direccion;
        this.largo = data.largo ? data.largo : this.largo;
        this.ancho = data.ancho ? data.ancho : this.ancho;
        this.codigo = data.codigo ? data.codigo : this.codigo;
        this.preciocompra = data.preciocompra ? data.preciocompra : this.preciocompra;
        this.preciocontrato = data.preciocontrato ? data.preciocontrato : this.preciocontrato;
        this.ganancia = data.ganancia ? data.ganancia : this.ganancia;
        this.npisos = data.npisos ? data.npisos : this.npisos;
        this.tcochera = data.tcochera ? data.tcochera : this.tcochera;
        this.contrato = data.contrato ? data.contrato : this.contrato;
        this.estadocontrato = data.estadocontrato ? data.estadocontrato : this.estadocontrato;
        this.estado = data.estado ? data.estado : this.estado;
    }
}