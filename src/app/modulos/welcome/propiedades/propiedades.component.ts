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
  public ubigeohabilitacionurbanas: Ubigeo[];
  public propiedades: any = []; // lista proyecto
  public propiedadesCopia: any = []; // lista proyecto
  public idPropiedad = 0; // parametro para la propiedad detalle
  public rangoprecio: Rangoprecios = new Rangoprecios();
  public servicios: Servicios[] = [];
  public constantes: any = LS;

  public departamentoSeleccionado: Ubigeo = null;
  public provinciaSeleccionado: Ubigeo = null;
  public distritoSeleccionado: Ubigeo = null;
  public habilitacionurbanaSeleccionado: Ubigeo = null;
  public provincia: Ubigeo;
  public distrito: Ubigeo;

  public idRangoPrecio: number = 0;
  public activar: Boolean = false;
  public verServicios: Boolean = false;

  public porescrito: boolean = true;

  public radiobutton: any;
  public listaRangoPrecios: any = LS.LISTA_RANGO_PRECIOS;

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

    this.ubigeodepartamentos = [];
    this.ubigeoprovincias = [];
    this.ubigeodistritos = [];
  }

  ngOnInit() {
    this.titleService.setTitle( LS.PAGINA_PROPIEDADES );
    this.tipopropiedades = LS.LISTA_PROPIEDADES;
    this.listarUbigeos(); // index ubigeos (departamento)
    this.rangoprecio.preciominimo = "0";
    this.parametros.tipopropiedad = LS.KEY_PROPIEDAD_SELECT ? this.utilService.seleccionarPropiedad(this.tipopropiedades) : null;
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
    this.departamentoSeleccionado = null;
    this.provinciaSeleccionado = null;
    this.distritoSeleccionado = null;
    this.habilitacionurbanaSeleccionado = null;
  }

  limpiarConstantesSearch() {
    LS.KEY_UBIGEO = [];
    LS.KEY_PROPIEDAD_SELECT = "";
    LS.KEY_CONTRATO_SELECT = "";
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
    console.log(this.rangoprecio);
    if (this.rangoprecio) {
      let rango = LS.LISTA_RANGO_PRECIOS.find(item => item.id == this.rangoprecio.id);
      console.log('rango');
      console.log(rango);
    }
  }

  cambiarPorEscrito() {
    console.log("por escrito: ",this.porescrito)
    if (this.porescrito) {
      this.rangoprecio = new Rangoprecios();
    } else {
      this.rangoprecio = null;
    }
  }

  limpiarPrecios() {
    this.rangoprecio = new Rangoprecios();
  }

  cambiarActivar(activar) {
    this.activar = !activar;
  }

  listarUbigeos() {
    // aca se lista los departamentos
    this.cargando = true;
    this.ubigeoService.litarUbigeos(this);
  }

  despuesDeListarUbigeos(data) {
    this.ubigeodepartamentos = data;
    if (LS.KEY_PROPIEDAD_SELECT) {
      const departamentos = this.ubigeodepartamentos.slice();
      // verificar si proviene de la busqueda en welcome: KEY_UBIGEO[]
      if (LS.KEY_UBIGEO.length > 0) {
        this.departamentoSeleccionado = departamentos.find(item => item.ubigeo === LS.KEY_UBIGEO[0]);
      } else {
        // Limpiar
        this.limpiarConstantesSearch();
        this.departamentoSeleccionado = departamentos.find(item => item.ubigeo === LS.KEY_CIUDAD_DEFECTO);
      }
      this.mostrarprovincias(this.departamentoSeleccionado);
    } else {
      this.cargando = false;
    }
    // se limpia KEY_PROPIEDAD_SELECT
    LS.KEY_PROPIEDAD_SELECT = "";
    console.log(data);
  }

  mostrarprovincias(departamentoSeleccionado: Ubigeo) {
    if (departamentoSeleccionado) {
      this.ubigeo.departamento = departamentoSeleccionado;
      console.log(departamentoSeleccionado);
      // mostrar provincias del departamento seleccionado
      this.mostrarubigeos(departamentoSeleccionado.tipoubigeo_id, departamentoSeleccionado.codigo); // provincias
      // this.mostrarlotes(departamento.tipoubigeo_id, departamento.codigo);
      //this.listarPropiedades();
    } else {
      this.propiedades = [];
      this.propiedadesCopia = [];
      this.ubigeoprovincias = [];
      this.ubigeodistritos = [];
      this.ubigeohabilitacionurbanas = [];
      this.ubigeo.provincia = new Ubigeo();
      this.ubigeo.distrito = new Ubigeo();
      // this.parametros.departamento = null;
      this.listarUbigeos();
    }
  }

  mostrardistritos(provinciaSeleccionado: Ubigeo) {
    if (provinciaSeleccionado) {
      this.ubigeo.provincia = provinciaSeleccionado;
      console.log(this.ubigeo.provincia);
      this.mostrarubigeos(provinciaSeleccionado.tipoubigeo_id, provinciaSeleccionado.codigo); // provincias
      //this.listarPropiedades();
    } else {
      this.ubigeodistritos = [];
      this.ubigeohabilitacionurbanas = [];
      this.ubigeo.distrito = new Ubigeo();
      this.ubigeo.provincia = new Ubigeo();
      // buscar por departamento (regresando al combo departamento)
      this.listarPropiedades();
      // this.parametros.departamento = null;
      // this.listarUbigeos();
    }
  }

  mostrarhabilitacionurbana(distritoSeleccionado: Ubigeo) {
    if (distritoSeleccionado) {
      this.ubigeo.distrito = distritoSeleccionado;
      console.log(this.ubigeo.distrito);
      this.mostrarubigeos(distritoSeleccionado.tipoubigeo_id, distritoSeleccionado.codigo);
      // se carga las habilitaciones urbanas
    } else {
      // this.ubigeodistritos = [];
      this.ubigeo.distrito = new Ubigeo();
      // limpio la habilitacion urbana
      this.listarPropiedades();
      // this.parametros.departamento = null;
      // this.listarUbigeos();
    }
    // this.comboHabilitacionesurbanas = [];
    // this.combohabilitacionUrbanaSeleccionada = null;
    // this.listarPropiedades();
  }

  // en ventas solo hay lotes
  listarPropiedades() {
    this.idPropiedad = 0;
    if (this.ubigeo.contrato.length !== 0 && this.parametros.tipopropiedad !== null
      && this.departamentoSeleccionado) {
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
    }
  }

  mostrarPropiedad() {
    this.cargando = true;
    if(!this.porescrito) {
      this.verificarRangoPrecioRadio();
    }
    this.ubigeo.rangoprecio = this.rangoprecio;
    this.ubigeo.propiedad = this.parametros.tipopropiedad;
    this.ubigeo.habilitacionurbana = this.habilitacionurbanaSeleccionado;
    console.log("Ubigeo:");
    console.log(this.ubigeo);
    this.propiedadesService.busquedaPropiedad(this.ubigeo, this);
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
    } else {
      this.propiedades = [];
    }
    this.cargando = false;
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
    this.ubigeoprovincias = [];
    this.ubigeodistritos = [];
    this.ubigeohabilitacionurbanas = [];
    this.departamentoSeleccionado = null;
    this.provinciaSeleccionado = null;
    this.distritoSeleccionado = null;
    this.habilitacionurbanaSeleccionado = null;
    this.cambiarPorEscrito();

  }

  mostrarubigeos(idtipoubigeo, codigo) {
    this.cargando = true;
    this.ubigeoService.mostrarUbigeos({idtipoubigeo: idtipoubigeo, codigo: codigo}, this);
  }

  despuesDeMostrarUbigeosProvincias(data) {
    this.cargando = false;
    this.ubigeoprovincias = data;
    console.log(data);
    // verificar si proviene de la busqueda en welcome: KEY_UBIGEO[]
    if (LS.KEY_UBIGEO.length > 1) { // si hay key de provincia
      const provincias = this.ubigeoprovincias.slice();
      this.provinciaSeleccionado = provincias.find(item => item.ubigeo === LS.KEY_UBIGEO[1]);
      this.mostrardistritos(this.provinciaSeleccionado);
    } else {
      // Limpiar
      this.limpiarConstantesSearch();
      this.listarPropiedades();
    }
  }

  despuesDeMostrarUbigeosDistritos(data) {
    this.cargando = false;
    this.ubigeodistritos = data;
    // verificar si proviene de la busqueda en welcome: KEY_UBIGEO[]
    if (LS.KEY_UBIGEO.length > 2) { // si hay key de provincia
      const distritos = this.ubigeodistritos.slice();
      this.distritoSeleccionado = distritos.find(item => item.ubigeo === LS.KEY_UBIGEO[2]);
      this.mostrarhabilitacionurbana(this.distritoSeleccionado);
    } else {
      // Limpiar
      this.limpiarConstantesSearch();
      this.listarPropiedades();
    }
    console.log(data);
  }

  despuesDeMostrarUbigeosHabilitacionUrbanas(data) {
    this.cargando = false;
    this.ubigeohabilitacionurbanas = data;
    if (LS.KEY_UBIGEO.length > 3) {
      const habilitacionesurbanas = this.ubigeohabilitacionurbanas.slice();
      this.habilitacionurbanaSeleccionado = habilitacionesurbanas.find(item => 
        item.ubigeo === LS.KEY_UBIGEO[3]);
    }
    // Limpiar
    this.limpiarConstantesSearch();
    this.listarPropiedades();
    console.log(data);
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
