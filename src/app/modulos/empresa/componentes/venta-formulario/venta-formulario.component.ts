import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LS } from 'src/app/contantes/app-constants';
import { VentaServiceService } from '../../ventas/venta-service.service';
import * as moment from 'moment';
import { UtilService } from 'src/app/servicios/util/util.service';
import { Venta } from 'src/app/entidades/entidad.venta';
import { VentaTO } from 'src/app/entidadesTO/empresa/VentaTO';
import { Persona } from 'src/app/entidades/entidad.persona';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CasasListadoComponent } from '../casas-listado/casas-listado.component';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { CasasService } from '../../propiedades/casas/casas.service';
import { ApartamentoService } from '../../propiedades/apartamentos/apartamento.service';
import { CocheraService } from '../../propiedades/cocheras/cochera.service';
import { LocalService } from '../../propiedades/locales/local.service';
import { LoteService } from '../../propiedades/lotes/lote.service';
import { ApartamentosListadoComponent } from '../apartamentos-listado/apartamentos-listado.component';
import { CocherasListadoComponent } from '../cocheras-listado/cocheras-listado.component';
import { LocalesListadoComponent } from '../locales-listado/locales-listado.component';
import { LotesListadoComponent } from '../lotes-listado/lotes-listado.component';
import { PersonasComponent } from '../../configuracion/personas/personas.component';

@Component({
  selector: 'app-venta-formulario',
  templateUrl: './venta-formulario.component.html',
  styleUrls: ['./venta-formulario.component.css']
})
export class VentaFormularioComponent implements OnInit {
  
  @Input() parametrosFormulario: any;
  @Output() enviarAccion = new EventEmitter();
  @Output() enviarActivar = new EventEmitter();
  public constantes: any = LS;
  public accion: string = null;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public cargando: boolean = false;
  public activar: boolean = false;
  public es: any = {}; //Locale Date (Obligatoria)
  public tituloForm: string = null;
  public venta: Venta = new Venta();
  public ventaTO: VentaTO = new VentaTO();
  public tipopropiedad: string = null;

  // propiedad
  public propiedad: any = null;
  public codigo: string = "";
  public ubigeo: Ubigeo = new Ubigeo();
  // cliente
  public cliente: Persona;

  // parametro formulario propiedad
  public parametroFormulario: any = null;

  constructor(
    private ventaService: VentaServiceService,
    private apartamentoService: ApartamentoService,
    private casasService: CasasService,
    private cocheraService: CocheraService,
    private localService: LocalService,
    private loteService: LoteService,
    private modalService: NgbModal,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.es = this.utilService.setLocaleDate();
    moment.locale('es'); // para la fecha
    this.cliente = new Persona();
  }

  ngOnChanges(changes) {
    if (changes.parametrosFormulario) {
      if (changes.parametrosFormulario.currentValue) {
        this.accion = this.parametrosFormulario.accion;
        this.tipopropiedad = this.parametrosFormulario.propiedad;
        this.ubigeo = this.parametrosFormulario.ubigeo;
        this.postIniciarVistaFormulario(this.tipopropiedad);
      }
    }
  }

  postIniciarVistaFormulario(tipopropiedad: string) { // accion NUEVO
    // se agrega el titulo del formulario y la accion
    switch (tipopropiedad) {
      case LS.TAG_APARTAMENTO:
        // PARA APARTAMENTO
        if (this.accion === LS.ACCION_CONSULTAR) {
          this.tituloForm = LS.TITULO_FORM_CONSULTAR_VENTA;
          this.traerParaEdicion(this.parametrosFormulario.ventaSeleccionado.id);
        } else if (this.accion === LS.ACCION_NUEVO){
          this.tituloForm = LS.TITULO_FORM_NUEVA_VENTA;
          this.parametroFormulario = {
            accion: this.accion,
            apartamento: null
          }
        }
        break;
      case LS.TAG_CASA:
        // PARA CASA
        if (this.accion === LS.ACCION_CONSULTAR) {
          this.tituloForm = LS.TITULO_FORM_CONSULTAR_VENTA;
          this.traerParaEdicion(this.parametrosFormulario.ventaSeleccionado.id);
        } else if (this.accion === LS.ACCION_NUEVO) {
          this.tituloForm = LS.TITULO_FORM_NUEVA_VENTA;
          this.parametroFormulario = {
            accion: this.accion,
            casa: null
          }
        }
        break;
      // case LS.TAG_COCHERA:
      //   // PARA COCHERA
      //   if (this.accion === LS.ACCION_CONSULTAR) {
      //     this.tituloForm = LS.TITULO_FORM_CONSULTAR_VENTA;
      //     this.traerParaEdicion(this.parametrosFormulario.ventaSeleccionado.id)
      //   } else if (this.accion === LS.ACCION_NUEVO) {
      //     this.tituloForm = LS.TITULO_FORM_NUEVA_VENTA;
      //     this.parametroFormulario = {
      //       accion: this.accion,
      //       cochera: null
      //     }
      //   }
        
      //   break;
      case LS.TAG_LOCAL:
        // PARA LOCAL
        if (this.accion === LS.ACCION_CONSULTAR) {
          this.tituloForm = LS.TITULO_FORM_CONSULTAR_VENTA;
          this.traerParaEdicion(this.parametrosFormulario.ventaSeleccionado.id)
        } else if (this.accion === LS.ACCION_NUEVO) {
          this.tituloForm = LS.TITULO_FORM_NUEVA_VENTA;
          this.parametroFormulario = {
            accion: this.accion,
            local: null
          }
        }
        break;
      case LS.TAG_LOTE:
        // PARA LOTE
        if (this.accion === LS.ACCION_CONSULTAR) {
          this.tituloForm = LS.TITULO_FORM_CONSULTAR_VENTA;
          this.traerParaEdicion(this.parametrosFormulario.ventaSeleccionado.id)
        } else if (this.accion === LS.ACCION_NUEVO) {
          this.tituloForm = LS.TITULO_FORM_NUEVA_VENTA;
          this.parametroFormulario = {
            accion: this.accion,
            lote: null
          }
        }
        break;
      default:
        break;
    }
  }

  traerParaEdicion(id) {
    // consulto la venta (traigo los datos de la venta en un dto "VentaDto")
    this.cargando = true;
    this.ventaService.mostrarVenta(id, this);
  }

  despuesDeMostrarVenta(data) {
    // aca mostramos los datos del dto en el formulario
    this.venta = this.convertirVentaDTOaVenta(data);
    this.cliente = data.cliente;
    this.mostrarPropiedadEnFormulario(this.venta, data);
    this.cargando = false;
  }

  mostrarPropiedadEnFormulario(venta: Venta, ventaDto) {
    switch (this.tipopropiedad) {
      case LS.TAG_APARTAMENTO:
        // MOSTRAR APARTAMENTO
        this.propiedad = ventaDto.apartamento_id;
        this.codigo = ventaDto.apartamento_id.codigo;
        this.parametroFormulario = {
          accion: this.accion,
          apartamento: ventaDto.apartamento_id // apartamento_id es el dtoApartamento
        }
        break;
      case LS.TAG_CASA:
        // MOSTRAR CASA
        this.propiedad = ventaDto.casa_id;
        this.codigo = ventaDto.casa_id.codigo;
        this.parametroFormulario = {
          accion: this.accion,
          casa: ventaDto.casa_id // casa_id es el dtoCasa
        }
        break;
      // case LS.TAG_COCHERA:
      //   // MOSTRAR COCHERA
      //   this.propiedad = ventaDto.cochera_id;
      //   this.codigo = ventaDto.cochera_id.codigo;
      //   this.parametroFormulario = {
      //     accion: this.accion,
      //     cochera: ventaDto.cochera_id // cochera_id es el dtoCochera
      //   }
      //   break;
      case LS.TAG_LOCAL:
        // MOSTRAR LOCAL
        this.propiedad = ventaDto.local_id;
        this.codigo = ventaDto.local_id.codigo;
        this.parametroFormulario = {
          accion: this.accion,
          local: ventaDto.local_id // local_id es el dtoLocal
        }
        break;
      case LS.TAG_LOTE:
        // MOSTRAR LOTE
        this.propiedad = ventaDto.lote_id;
        this.codigo = ventaDto.lote_id.codigo;
        this.parametroFormulario = {
          accion: this.accion,
          lote: ventaDto.lote_id // lote_id es el dtoLocal
        }
        break;
      default:
        break;
    }
  }

  convertirVentaDTOaVenta(data): Venta {
    let venta = new Venta();
    venta.id = data.id;
    venta.apartamento_id = data.apartamento_id ? data.apartamento_id.id : null;
    venta.casa_id = data.casa_id ? data.casa_id.id : null;
    venta.cochera_id = data.cochera_id ? data.cochera_id.id : null;
    venta.local_id = data.local_id ? data.local_id.id : null;
    venta.lote_id = data.lote_id ? data.lote_id.id : null;
    return venta;
  }

  buscarPropiedad() { // boton buscar (propiedad) en el formulario
    switch (this.tipopropiedad) {
      case LS.TAG_APARTAMENTO:
        this.buscarApartamento();
        break;
      case LS.TAG_CASA:
        this.buscarCasas();
        break;
      case LS.TAG_COCHERA:
        this.buscarCochera();
        break;
      case LS.TAG_LOCAL:
        this.buscaLocal();
        break;
      case LS.TAG_LOTE:
        this.buscarLote();
        break;
      default:
        break;
    }
  }

  // APARTAMENTO
  buscarApartamento() {
    const modalRef = this.modalService.open(ApartamentosListadoComponent, {size: 'lg', keyboard: true });
    let parametros = {
      codigo: '', // this.codigo
      contrato: 'V',
      ubigeo: this.ubigeo
    }
    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.parametrosBusqueda = parametros;
    modalRef.result.then((result) => {
      if (this.venta.apartamento_id !== result.id) {
        this.propiedad = result;
        this.codigo = result.codigo; // result es casaTO
        this.venta.apartamento_id = result.id;
        // para consultar y editar en modal casa
        this.cargando = true;
        this.apartamentoService.mostrarApartamento(this.venta.apartamento_id, this);
        // this.auth.agregarmodalopenclass();
      }
    }, (reason) => {
      // this.auth.agregarmodalopenclass();
    });
  }

  despuesDeMostrarApartamento(data) { // el dtoApartamento
    this.cargando = false;
    this.parametroFormulario = {
      accion: LS.ACCION_CONSULTAR,
      apartamento: data
    }
  }

  // CASA
  buscarCasas() {
    const modalRef = this.modalService.open(CasasListadoComponent, {size: 'lg', keyboard: true });
    let parametros = {
      codigo: '', // this.codigo
      contrato: 'V',
      ubigeo: this.ubigeo
    }
    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.parametrosBusqueda = parametros;
    modalRef.result.then((result) => {
      if (this.venta.casa_id !== result.id) {
        this.propiedad = result;
        this.codigo = result.codigo; // result es casaTO
        this.venta.casa_id = result.id;
        // para consultar y editar en modal casa
        this.cargando = true;
        this.casasService.mostrarCasa(this.venta.casa_id, this);
        // this.auth.agregarmodalopenclass();
      }
    }, (reason) => {
      // this.auth.agregarmodalopenclass();
    });
  }

  despuesDeMostrarCasa(data) { // el dtoCasa
    this.cargando = false;
    this.parametroFormulario = {
      accion: LS.ACCION_CONSULTAR,
      casa: data
    }
  }

  // COCHERA
  buscarCochera() {
    const modalRef = this.modalService.open(CocherasListadoComponent, {size: 'lg', keyboard: true });
    let parametros = {
      codigo: '', // this.codigo
      contrato: 'V',
      ubigeo: this.ubigeo
    }
    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.parametrosBusqueda = parametros;
    modalRef.result.then((result) => {
      if(this.venta.cochera_id !== result.id) {
        this.propiedad = result;
        this.codigo = result.codigo; // result es casaTO
        this.venta.cochera_id = result.id;
        // para consultar y editar en modal casa
        this.cargando = true;
        this.cocheraService.mostrarCochera(this.venta.cochera_id, this);
        // this.auth.agregarmodalopenclass();
      }
    }, (reason) => {
      // this.auth.agregarmodalopenclass();
    });
  }

  despuesDeMostrarCochera(data) { // el dtoCochera
    this.cargando = false;
    this.parametroFormulario = {
      accion: LS.ACCION_CONSULTAR,
      cochera: data
    }
  }

  // LOCAL
  buscaLocal() {
    const modalRef = this.modalService.open(LocalesListadoComponent, {size: 'lg', keyboard: true });
    let parametros = {
      codigo: '', // this.codigo
      contrato: 'V',
      ubigeo: this.ubigeo
    }
    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.parametrosBusqueda = parametros;
    modalRef.result.then((result) => {
      if (this.venta.local_id !== result.id) {
        this.propiedad = result;
        this.codigo = result.codigo; // result es casaTO
        this.venta.local_id = result.id;
        // para consultar y editar en modal casa
        this.cargando = true;
        this.localService.mostrarLocal(this.venta.local_id, this);
        // this.auth.agregarmodalopenclass();
      }
    }, (reason) => {
      // this.auth.agregarmodalopenclass();
    });
  }

  despuesDeMostrarLocal(data) { // el dtoLocal
    this.cargando = false;
    this.parametroFormulario = {
      accion: LS.ACCION_CONSULTAR,
      local: data
    }
  }

  // LOTE
  buscarLote() {
    const modalRef = this.modalService.open(LotesListadoComponent, {size: 'lg', keyboard: true });
    let parametros = {
      codigo: '', // this.codigo
      contrato: 'V',
      ubigeo: this.ubigeo
    }
    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.parametrosBusqueda = parametros;
    modalRef.result.then((result) => {
      if (this.venta.lote_id !== result.id) {
        this.propiedad = result;
        this.codigo = result.codigo; // result es casaTO
        this.venta.lote_id = result.id;
        // para consultar y editar en modal casa
        this.cargando = true;
        this.loteService.mostrarLote(this.venta.lote_id, this);
        // this.auth.agregarmodalopenclass();
      }
    }, (reason) => {
      // this.auth.agregarmodalopenclass();
    });
  }

  despuesDeMostrarLote(data) { // el dtoLote
    this.cargando = false;
    this.parametroFormulario = {
      accion: LS.ACCION_CONSULTAR,
      lote: data
    }
  }

  buscarcliente() {
    const modalRef = this.modalService.open(PersonasComponent, {size: 'lg', keyboard: true});
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((result) => {
      this.cliente = result;
      this.venta.persona_id = result.id;
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      // this.auth.agregarmodalopenclass();
    });
  }

  insertarVenta() {
    const parametros = {
      title: LS.MSJ_TITULO_VENTA,
      texto: LS.MSJ_PREGUNTA_VENTA + "<br> " + LS.TAG_CODIGO_PROPIEDAD + ": " + this.codigo,
      type: LS.SWAL_QUESTION,
      confirmButtonText: LS.LABEL_ACEPTAR,
      cancelButtonText: LS.LABEL_CANCELAR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) { // REALIZAR LA VENTA
        this.cargando = true;
        console.log(this.utilService.obtenerFechaActual());
        console.log(new Date(this.utilService.obtenerFechaActual()));
        this.venta.fecha = this.utilService.obtenerFechaActual();
        console.log(this.venta.fecha);
        console.log('Venta antes de ingresar');
        console.log(this.venta);
        this.ventaService.ingresarVenta(this.venta, this);
      } else { // SE CANCELO LA VENTA
        this.cargando = false;
      }
    });
  }

  despuesDeIngresarVenta(data) {
    this.cargando = false;
    let ventaTO = this.convertirVentaAVentaTO(data);
    let parametros = {
      accion : this.accion,
      ventaTO: ventaTO
    }
    console.log('despues de insertar venta');
    console.log(parametros);
    this.enviarAccion.emit(parametros);
  }

  convertirVentaAVentaTO(data): VentaTO {
    let ventaTO = new VentaTO();
    ventaTO.id = data.id;
    ventaTO.estadocontrato = 'V';
    ventaTO.foto = this.propiedad.foto
    ventaTO.propiedad_id = this.propiedad.id;
    ventaTO.propiedad_codigo = this.propiedad.codigo;
    ventaTO.propietario = this.propiedad.propietario;
    ventaTO.cliente = this.cliente.nombres;
    ventaTO.ubicacion = this.propiedad.ubicacion;
    ventaTO.direccion = this.propiedad.direccion;
    ventaTO.preciocontrato = this.propiedad.preciocontrato;
    ventaTO.fechaVenta = this.venta.fecha;
    return ventaTO;
  }

  cambiarActivar(estado) {
    this.activar = !estado;
    this.enviarActivar.emit(estado);
  }

  cancelar() {
    let parametros = {
      accion : LS.ACCION_CANCELAR,
      ventaTO: this.ventaTO
    }
    this.enviarAccion.emit(parametros);
  }
}
