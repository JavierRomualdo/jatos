import { Component, OnInit } from "@angular/core";
import { Title } from '@angular/platform-browser';
import { UbigeoGuardar } from "../../../entidades/entidad.ubigeoguardar";
import { Rangoprecios } from "../../../entidades/entidadad.rangoprecios";
import { Servicios } from "../../../entidades/entidad.servicios";
import { Ubigeo } from "../../../entidades/entidad.ubigeo";
import { LS } from 'src/app/contantes/app-constants';
import { UtilService } from 'src/app/servicios/util/util.service';
import { UbigeoService } from '../../empresa/configuracion/ubigeo/modal-ubigeo/ubigeo.service';
import { ServicioService } from '../../empresa/configuracion/servicios/servicio.service';
import { PropiedadesService } from './propiedades.service';
import { HabilitacionUrbana } from 'src/app/entidades/entidad.habilitacionurbana';
import { ComboHabilitacionUrbana } from 'src/app/entidades/entidadesCombo/entidad.comboHabilitacionUrbana';

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
  public comboHabilitacionesurbanas: ComboHabilitacionUrbana[];
  public CombohabilitacionUrbanaSeleccionada: ComboHabilitacionUrbana = undefined;
  public propiedades: any = []; // lista proyecto
  public propiedadesCopia: any = []; // lista proyecto
  public idPropiedad = 0; // parametro para la propiedad detalle
  public rangoprecio: Rangoprecios = undefined;
  public servicios: Servicios[] = [];
  public constantes: any = LS;

  // tslint:disable-next-line:no-inferrable-types
  public idUbigeoDepartamento: number = 0;
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
    private ubigeoService: UbigeoService,
    private servicioService: ServicioService,
    private propiedadesService: PropiedadesService,
    private utilService: UtilService,
    private titleService: Title
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
    this.titleService.setTitle( LS.PAGINA_PROPIEDADES );
    this.tipopropiedades = LS.LISTA_PROPIEDADES;
    // this.parametros.tipopropiedad = "";
    this.listarUbigeos(); // index ubigeos (departamento)
    // this.rangoprecio.preciominimo = "0";
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
    LS.KEY_PROPIEDAD_SELECT = parametros.propiedad;
    this.listarUbigeos();
    // this.despuesDeListarUbigeos(this.ubigeodepartamentos);
    // this.listarPropiedades();
    this.parametros.tipopropiedad = parametros.propiedad;
    this.propiedades = [];
    this.cerrarPropiedadDetalle();
    this.idUbigeoDepartamento = 0;
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
    this.rangoprecio.preciominimo = rango.preciominimo;
    this.rangoprecio.preciomaximo = rango.preciomaximo;
  }

  cambiarActivar(activar) {
    this.activar = !activar;
  }

  listarUbigeos() {
    this.cargando = true;
    this.ubigeoService.litarUbigeos(this);
  }

  despuesDeListarUbigeos(data) {
    this.ubigeodepartamentos = data;
    if (LS.KEY_PROPIEDAD_SELECT) {
      const departamentos = this.ubigeodepartamentos.slice();
      this.idUbigeoDepartamento = departamentos.find(item => item.ubigeo === LS.KEY_CIUDAD_DEFECTO).id;
      this.mostrarprovincias(this.idUbigeoDepartamento);
      this.listarPropiedades();
    }
    // se limpia KEY_PROPIEDAD_SELECT
    LS.KEY_PROPIEDAD_SELECT = "";
    this.cargando = false;
    console.log(data);
  }

  mostrarprovincias(idUbigeoDepartamento) {
    if (idUbigeoDepartamento > 0) {
      this.ubigeo.departamento = this.ubigeodepartamentos.find(item => item.id === idUbigeoDepartamento)
      console.log(this.ubigeo.departamento);
      this.mostrarubigeos(this.ubigeo.departamento.tipoubigeo_id, this.ubigeo.departamento.codigo); // provincias
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

  mostrardistritos(idUbigeoProvincia) {
    if (idUbigeoProvincia > 0) {
      this.ubigeo.provincia = this.ubigeoprovincias.find(item => item.id === idUbigeoProvincia)
      console.log(this.ubigeo.provincia);
      this.mostrarubigeos(this.ubigeo.provincia.tipoubigeo_id, this.ubigeo.provincia.codigo); // provincias
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

  mostrarpadistritos(idUbigeoDistrito) {
    if (idUbigeoDistrito > 0) {
      this.ubigeo.distrito = this.ubigeodistritos.find(item => item.id === idUbigeoDistrito)
      console.log(this.ubigeo.distrito);
      //this.listarPropiedades();
      // se carga las habilitaciones urbanas
    } else {
      // this.ubigeodistritos = [];
      this.ubigeo.distrito = new Ubigeo();
      //this.listarPropiedades();
      // this.parametros.departamento = null;
      // this.listarUbigeos();
    }
    // limpio la habilitacion urbana
    this.comboHabilitacionesurbanas = [];
    this.CombohabilitacionUrbanaSeleccionada = undefined;
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
    if (this.idUbigeoDepartamento === 0) {
      mensaje += " ubigeo.";
    }
    console.log("mensaje.." + mensaje);
    if (mensaje == "") {
      if (this.parametros.tipopropiedad === LS.TAG_CASA) {
        this.mostrarPropiedad();
        // this.listarServicios();
      } else if (this.parametros.tipopropiedad === LS.TAG_COCHERA) {
        this.mostrarPropiedad();
        // this.listarServicios();
      } else if (this.parametros.tipopropiedad === LS.TAG_APARTAMENTO) {
        this.mostrarPropiedad();
        // this.listarServicios();
      } else if (this.parametros.tipopropiedad === LS.TAG_HABITACION) {
        this.mostrarPropiedad();
        // this.listarServicios();
      } else if (this.parametros.tipopropiedad === LS.TAG_LOCAL) {
        this.mostrarPropiedad();
        // this.listarServicios();
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
    // caca vemos si escogio habilitacionurbana (solo busca el listado anterior)
    if (!this.CombohabilitacionUrbanaSeleccionada) {
      // para los rangos de precios
      if(!this.porescrito) {
        this.verificarRangoPrecioRadio();
      }
      this.ubigeo.rangoprecio = this.rangoprecio;
      this.ubigeo.propiedad = this.parametros.tipopropiedad;
      console.log("Ubigeo:");
      console.log(this.ubigeo);
      this.propiedadesService.busquedaPropiedad(this.ubigeo, this);
    } else {
      // si esta el combo habilitacionselecciondo
      this.cargando = true;
      const copiaPropiedeades = this.propiedadesCopia.slice();
      const nuevasPropiedades = copiaPropiedeades.filter(item => item.idHabilitacionUrbana === this.CombohabilitacionUrbanaSeleccionada.id);
      this.propiedades = nuevasPropiedades;
      this.cargando = false;
    }
    
  }

  despuesDeBusquedaPropiedad(data) {
    console.log("resultado: ");
    console.log(data);
    if (data !== "vacio") {
      this.propiedades = data;
      this.propiedadesCopia = data;
      console.log("Ubigeo:");
      console.log(this.ubigeo);
      console.log("Los lotes son:");
      console.log(data);
      //
      this.listarHabilitacionesUrbanas(data);
    } else {
      this.propiedades = [];
    }
    this.cargando = false;
  }

  listarHabilitacionesUrbanas(propiedades: any) {
    if (this.idUbigeoDistrito > 0 ) {
      propiedades.forEach(element => {
        const parametros = {
          id: element.idHabilitacionUrbana,
          siglas: element.siglas,
          nombrehabilitacionurbana: element.nombrehabilitacionurbana
        }
        const habilitacionurbana: ComboHabilitacionUrbana = new ComboHabilitacionUrbana(parametros);
        this.comboHabilitacionesurbanas.push(habilitacionurbana);
      });
    }
  }

  listarServicios() {
    this.verServicios = true;
    if (this.servicios.length === 0) {
      this.servicioService.listarServicios({activos: true}, this);
    }
  }

  despuesDeListarServicios(data) {
    this.servicios = data;
    console.log("Servicios:");
    console.log(this.servicios);
    this.cargando = false;
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
    this.ubigeoService.mostrarUbigeos({idtipoubigeo: idtipoubigeo, codigo: codigo}, this);
  }

  despuesDeMostrarUbigeosProvincias(data) {
    this.cargando = false;
    this.ubigeoprovincias = data;
    this.idUbigeoProvincia = 0;
    console.log("idUbigeoProvincia", this.idUbigeoProvincia);
    console.log(data);
    // limpio la habilitacion urbana
    this.comboHabilitacionesurbanas = [];
    this.CombohabilitacionUrbanaSeleccionada = undefined;
  }

  despuesDeMostrarUbigeosDistritos(data) {
    this.ubigeodistritos = data;
    this.cargando = false;
    console.log(data);
    // limpio la habilitacion urbana
    this.comboHabilitacionesurbanas = [];
    this.CombohabilitacionUrbanaSeleccionada = undefined;
  }

  /************* Metodos de propiedad detalle ***************/
  verDetalle(id) {
    this.cambiarActivar(this.activar);
    this.idPropiedad = id;
  }

  cerrarPropiedadDetalle() {
    this.cambiarActivar(this.activar);
    this.idPropiedad = 0;
  }

  paginate(event) {
    this.propiedades = this.propiedadesCopia.slice(event.first, event.first+event.rows);
  }
}
