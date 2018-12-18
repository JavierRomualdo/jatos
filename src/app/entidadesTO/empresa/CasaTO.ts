export class CasaTO {
    id: number;//
    foto: string = null;
    propietario: string = "";//
    ubicacion: string = "";//
    direccion: string = "";
    largo: number = 0;
    ancho: number = 0;
    codigo: string = "";
    costo: number = 0.00;
    precio: number = 0.00;
    npisos: number = 0;
    ncuartos: number = 0;
    nbanios: number = 0;
    tjardin: boolean = false;
    tcochera: boolean = false;
    estadocontrato: string = 'L';
    estado: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.foto = data.foto ? data.foto : this.foto;
        this.propietario = data.propietario ? data.propietario : this.propietario;
        this.ubicacion = data.ubicacion ? data.ubicacion : this.ubicacion;
        this.direccion = data.direccion ? data.direccion : this.direccion;
        this.largo = data.largo ? data.largo : this.largo;
        this.ancho = data.ancho ? data.ancho : this.ancho;
        this.codigo = data.codigo ? data.codigo : this.codigo;
        this.costo = data.costo ? data.costo : this.costo;
        this.precio = data.precio ? data.precio : this.precio;
        this.npisos = data.npisos ? data.npisos : this.npisos;
        this.ncuartos = data.ncuartos ? data.ncuartos : this.ncuartos;
        this.nbanios = data.nbanios ? data.nbanios : this.nbanios;
        this.tjardin = data.tjardin ? data.tjardin : this.tjardin;
        this.tcochera = data.tcochera ? data.tcochera : this.tcochera;
        this.estadocontrato = data.estadocontrato ? data.estadocontrato : this.estadocontrato;
        this.estado = data.estado ? data.estado : this.estado;
    }
}