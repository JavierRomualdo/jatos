export class CasaTO {
    id: number;//
    foto: string = null;
    propietario: string = "";//
    ubicacion: string = "";//
    siglas: string = ""; // siglas de habilitacion urbana
    nombrehabilitacionurbana: string = "";
    direccion: string = "";
    largo: number = 0;
    ancho: number = 0;
    codigo: string = "";
    precioadquisicion: number = 0.00;
    preciocontrato: number = 0.00;
    ganancia: number = 0.00;
    npisos: number = 0;
    ncuartos: number = 0;
    nbanios: number = 0;
    tjardin: boolean = false;
    tcochera: boolean = false;
    contrato: string = "";
    nmensajes: number = 0;
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
        this.siglas = data.siglas ? data.siglas : this.siglas;
        this.nombrehabilitacionurbana = data.nombrehabilitacionurbana ? data.nombrehabilitacionurbana : this.nombrehabilitacionurbana;
        this.direccion = data.direccion ? data.direccion : this.direccion;
        this.largo = data.largo ? data.largo : this.largo;
        this.ancho = data.ancho ? data.ancho : this.ancho;
        this.codigo = data.codigo ? data.codigo : this.codigo;
        this.precioadquisicion = data.precioadquisicion ? data.precioadquisicion : this.precioadquisicion;
        this.preciocontrato = data.preciocontrato ? data.preciocontrato : this.preciocontrato;
        this.ganancia = data.ganancia ? data.ganancia : this.ganancia;
        this.npisos = data.npisos ? data.npisos : this.npisos;
        this.ncuartos = data.ncuartos ? data.ncuartos : this.ncuartos;
        this.nbanios = data.nbanios ? data.nbanios : this.nbanios;
        this.tjardin = data.tjardin ? data.tjardin : this.tjardin;
        this.tcochera = data.tcochera ? data.tcochera : this.tcochera;
        this.contrato = data.contrato ? data.contrato : this.contrato;
        this.nmensajes = data.nmensajes ? data.nmensajes : this.nmensajes;
        this.estadocontrato = data.estadocontrato ? data.estadocontrato : this.estadocontrato;
        this.estado = data.estado ? data.estado : this.estado;
    }
}