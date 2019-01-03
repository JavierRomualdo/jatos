export class LoteTO {
    id: number;//
    foto: string = null;
    propietario: string = "";//
    ubicacion: string = "";//
    direccion: string = "";
    largo: number = 0;
    ancho: number = 0;
    codigo: string = "";
    precioadquisicion: number = 0.00;
    preciocontrato: number = 0.00;
    ganancia: number = 0.00;
    contrato: string = "";
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
        this.precioadquisicion = data.precioadquisicion ? data.precioadquisicion : this.precioadquisicion;
        this.preciocontrato = data.preciocontrato ? data.preciocontrato : this.preciocontrato;
        this.ganancia = data.ganancia ? data.ganancia : this.ganancia;
        this.contrato = data.contrato ? data.contrato : this.contrato;
        this.estadocontrato = data.estadocontrato ? data.estadocontrato : this.estadocontrato;
        this.estado = data.estado ? data.estado : this.estado;
    }
}