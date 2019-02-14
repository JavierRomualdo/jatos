import { Component, OnInit } from "@angular/core";
import { UbigeoGuardar } from "../../../entidades/entidad.ubigeoguardar";
import { Rangoprecios } from "../../../entidades/entidadad.rangoprecios";
import { ApiRequest2Service } from "../../../servicios/api-request2.service";
import { ToastrService } from "ngx-toastr";
import { Servicios } from "../../../entidades/entidad.servicios";
import { Ubigeo } from "../../../entidades/entidad.ubigeo";
import { LS } from 'src/app/contantes/app-constants';
import { UtilService } from 'src/app/servicios/util/util.service';
@Component({
  selector: "app-propiedades",
  templateUrl: "./propiedades.component.html",
  styleUrls: ["./propiedades.component.css"]
})
export class PropiedadesComponent implements OnInit {
  public tipopropiedades: string[] = [];
  public parametros: any = {};
  public ubigeo: UbigeoGuardar;
  public cargando: Boolean = false;
  public ubigeodepartamentos: Ubigeo[];
  public ubigeoprovincias: Ubigeo[];
  public ubigeodistritos: Ubigeo[]; // son ubigeos de distritos que muestra en la tabla
  public propiedades: any = []; // lista proyecto
  public idPropiedad = 0; // parametro para la propiedad detalle
  public rangoprecio = new Rangoprecios();
  public servicios: Servicios[] = [];
  public constantes: any = LS;

  public departamento: Ubigeo = null;
  // tslint:disable-next-line:no-inferrable-types
  public idUbigeoProvincia: number = 0;
  public provincia: Ubigeo;
  // tslint:disable-next-line:no-inferrable-types
  public idUbigeoDistrito: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  public distrito: Ubigeo;

  public idRangoPrecio: number = 0;
  public activar: Boolean = false;
  public verServicios: Boolean = false;

  public porescrito: boolean = true;

  public radiobutton: any;
  public listaRangoPrecios: any = LS.LISTA_RANGO_PRECIOS;
  public rangoPrecio: any;

  constructor(
    private api: ApiRequest2Service,
    private toastr: ToastrService,
    private utilService: UtilService
    ) {
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.distrito = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.ubigeo.rangoprecio = new Rangoprecios();

    this.ubigeodepartamentos = [];
    this.ubigeoprovincias = [];
    this.ubigeodistritos = [];
  }

  ngOnInit() {
    this.tipopropiedades = LS.LISTA_PROPIEDADES;
    this.departamento = null;
    // this.parametros.tipopropiedad = "";
    this.listarUbigeos(); // index ubigeos (departamento)
    this.rangoprecio.preciominimo = "0";
    this.parametros.tipopropiedad = LS.KEY_PROPIEDAD_SELECT ? this.utilService.seleccionarPropiedad(this.tipopropiedades) : '';
    if (LS.KEY_CONTRATO_SELECT) {
      this.ubigeo.contrato = [];
      this.ubigeo.contrato.push(LS.KEY_CONTRATO_SELECT);
      LS.KEY_CONTRATO_SELECT = "";
    } else {
      this.ubigeo.contrato = LS.LISTA_CONTRATO;
    }
    // LS.KEY_CONTRATO_SELECT ? this.ubigeo.contrato.push(LS.KEY_CONTRATO_SELECT) : "";
  }

  ejecutarAccion(parametros) {
    this.parametros.tipopropiedad = parametros.propiedad;
    this.propiedades = [];
    this.cerrarPropiedadDetalle();
    this.departamento = null;
    this.idUbigeoProvincia = 0;
    this.idUbigeoDistrito = 0;
  }

  cambiarTipoPropiedad() {
    if (this.ubigeo.contrato.length > 1) {
      this.tipopropiedades = LS.LISTA_PROPIEDADES;
    } else {
      if (this.ubigeo.contrato[0]==='V') {
        this.tipopropiedades = LS.LISTA_PROPIEDADES_VENTA;
      } else {
        this.tipopropiedades = LS.LISTA_PROPIEDADES;
      }
    }
  }

  verificarRangoPrecioRadio() {
    console.log(this.rangoPrecio);
    let rango = LS.LISTA_RANGO_PRECIOS.find(item => item.id == this.rangoPrecio);
    console.log('rango');
    console.log(rango);
    this.rangoprecio.preciominimo = rango.precionminimo;
    this.rangoprecio.preciomaximo = rango.preciomaximo;
  }

  cambiarActivar(activar) {
    this.activar = !activar;
  }

  listarUbigeos() {
    this.cargando = true;
    this.api
      .get2("ubigeos")
      .then(
        res => {
          this.ubigeodepartamentos = res;
          this.departamento = null;
          if (LS.KEY_PROPIEDAD_SELECT) {
            const departamentos = this.ubigeodepartamentos.slice();
            this.departamento = departamentos.find(item => item.ubigeo === LS.KEY_CIUDAD_DEFECTO);
            this.mostrarprovincias(this.departamento);
            this.listarPropiedades();
          }
          // se limpia KEY_PROPIEDAD_SELECT
          LS.KEY_PROPIEDAD_SELECT = "";
          this.cargando = false;
          console.log(res);
        },
        error => {
          if (error.status === 422) {
            // this.errors = [];
            const errors = error.json();
            console.log("Error");
            // this.cargando = false;
            /*for (const key in errors) {
            this.errors.push(errors[key]);
          }*/
          }
        }
      )
      .catch(err => this.handleError(err));
  }

  mostrarprovincias(departamento: Ubigeo) {
    if (departamento !== null) {
      this.ubigeo.departamento = departamento;
      console.log(departamento);
      this.mostrarubigeos(departamento.tipoubigeo_id, departamento.codigo); // provincias
      // this.mostrarlotes(departamento.tipoubigeo_id, departamento.codigo);
      //this.listarPropiedades();
    } else {
      this.propiedades = [];
      this.ubigeoprovincias = [];
      this.ubigeodistritos = [];
      this.ubigeo.provincia = new Ubigeo();
      this.ubigeo.distrito = new Ubigeo();
      // this.parametros.departamento = null;
      // this.listarUbigeos();
    }
  }

  mostrardistritos(idubigeo) {
    if (idubigeo > 0) {
      let provincia: Ubigeo = new Ubigeo();
      for (const ubigeo of this.ubigeoprovincias) {
        if (idubigeo === ubigeo.id) {
          provincia = ubigeo;
        }
      }
      this.ubigeo.provincia = provincia;
      console.log(provincia);
      this.mostrarubigeos(provincia.tipoubigeo_id, provincia.codigo); // provincias
      //this.listarPropiedades();
    } else {
      this.ubigeodistritos = [];
      this.ubigeo.distrito = new Ubigeo();
      this.ubigeo.provincia = new Ubigeo();
      // buscar por departamento (regresando al combo departamento)
      //this.listarPropiedades();
      // this.parametros.departamento = null;
      // this.listarUbigeos();
    }
  }

  mostrarpadistritos(idubigeo) {
    if (idubigeo > 0) {
      let distrito: Ubigeo = new Ubigeo();
      for (const ubigeo of this.ubigeodistritos) {
        if (idubigeo === ubigeo.id) {
          distrito = ubigeo;
        }
      }
      this.ubigeo.distrito = distrito;
      console.log(distrito);
      //this.listarPropiedades();
    } else {
      // this.ubigeodistritos = [];
      this.ubigeo.distrito = new Ubigeo();
      //this.listarPropiedades();
      // this.parametros.departamento = null;
      // this.listarUbigeos();
    }
  }

  // en ventas solo hay lotes
  listarPropiedades() {
    let mensaje: String = "";
    this.idPropiedad = 0;
    if (this.ubigeo.contrato.length === 0) {
      mensaje += " tipo servicio. ";
    }
    if (this.parametros.tipopropiedad === "") {
      mensaje += " propiedad. ";
    }
    if (this.departamento === null) {
      mensaje += " ubigeo.";
    }
    console.log("mensaje.." + mensaje);
    if (mensaje == "") {
      if (this.parametros.tipopropiedad === LS.TAG_CASA) {
        this.mostrarPropiedad();
        this.listarServicios();
      } else if (this.parametros.tipopropiedad === LS.TAG_COCHERA) {
        this.mostrarPropiedad();
        this.listarServicios();
      } else if (this.parametros.tipopropiedad === LS.TAG_APARTAMENTO) {
        this.mostrarPropiedad();
        this.listarServicios();
      } else if (this.parametros.tipopropiedad === LS.TAG_HABITACION) {
        this.mostrarPropiedad();
        this.listarServicios();
      } else if (this.parametros.tipopropiedad === LS.TAG_LOCAL) {
        this.mostrarPropiedad();
        this.listarServicios();
      } else if (this.parametros.tipopropiedad === LS.TAG_LOTE) {
        this.mostrarPropiedad();
        this.verServicios = false;
      }
    } else {
      this.propiedades = [];
      // this.toastr.info("Ingrese: " + mensaje);
    }
  }

  mostrarPropiedad() {
    this.cargando = true;
    // para los rangos de precios
    if(!this.porescrito) {
      this.verificarRangoPrecioRadio();
    }
    this.ubigeo.rangoprecio = this.rangoprecio;
    this.ubigeo.propiedad = this.parametros.tipopropiedad;
    console.log("Ubigeo:");
    console.log(this.ubigeo);
    this.api
      .post2("busquedaPropiedad", this.ubigeo)
      .then(
        res => {
          console.log("resultado: ");
          console.log(res);
          if (res !== "vacio") {
            this.propiedades = res;
            console.log("Ubigeo:");
            console.log(this.ubigeo);
            console.log("Los lotes son:");
            console.log(res);
          } else {
            this.propiedades = [];
          }
          this.cargando = false;
        },
        error => {
          if (error.status === 422) {
            // .errors = [];
            const errors = error.json();
            console.log("Error");
            // this.cargando = false;
            /*for (const key in errors) {
            this.errors.push(errors[key]);
          }*/
          }
        }
      )
      .catch(err => this.handleError(err));
  }

  listarServicios() {
    this.verServicios = true;
    if (this.servicios.length === 0) {
      this.api
        .get2("servicios")
        .then(
          res => {
            this.servicios = res;
            console.log("Servicios:");
            console.log(this.servicios);
            this.cargando = false;
          },
          error => {
            if (error.status === 422) {
              const errors = error.json();
              console.log("Error");
            }
          }
        )
        .catch(err => this.handleError(err));
    }
  }
  redondear(numero) {
    return Math.round(numero);
  }

  limpiar() {
    this.propiedades = [];
    this.ubigeo = new UbigeoGuardar();
    // this.ubigeodepartamentos = [];
    this.ubigeoprovincias = [];
    this.ubigeodistritos = [];
  }

  mostrarubigeos(idtipoubigeo, codigo) {
    this.cargando = true;
    this.api
      .get2("mostrarubigeos/" + idtipoubigeo + "/" + codigo)
      .then(
        res => {
          if (idtipoubigeo === 1) {
            // departamento
            // listo las provincias del departamento
            this.ubigeoprovincias = res;
            // this.ubigeos = this.ubigeoprovincias;
          } else if (idtipoubigeo === 2) {
            // provincia
            // listo los distritos de la provincia
            this.ubigeodistritos = res; // distritos
          }
          // this.ubigeos = res;
          this.cargando = false;
          console.log(res);
        },
        error => {
          if (error.status === 422) {
            // this.errors = [];
            const errors = error.json();
            console.log("Error");
            // this.cargando = false;
            /*for (const key in errors) {
            this.errors.push(errors[key]);
          }*/
          }
        }
      )
      .catch(err => this.handleError(err));
  }

  private handleError(error: any): void {
    // this.cargando = false;
    this.toastr.error("Error Interno: " + error, "Error");
  }

  /************* Metodos de propiedad detalle ***************/
  verDetalle(id) {
    this.idPropiedad = id;
  }

  cerrarPropiedadDetalle() {
    this.idPropiedad = 0;
  }
}
