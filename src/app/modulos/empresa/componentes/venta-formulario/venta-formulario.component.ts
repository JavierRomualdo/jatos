import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LS } from 'src/app/contantes/app-constants';
import { VentaServiceService } from '../../ventas/venta-service.service';
import * as moment from 'moment';
import { UtilService } from 'src/app/servicios/util/util.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Venta } from 'src/app/entidades/entidad.venta';
import { VentaTO } from 'src/app/entidadesTO/empresa/VentaTO';
import { Persona } from 'src/app/entidades/entidad.persona';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalPersonaComponent } from '../../configuracion/empresa/modal-persona/modal-persona.component';
import { CasasListadoComponent } from '../casas-listado/casas-listado.component';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { CasasService } from '../../propiedades/casas/casas.service';

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
  accion: string = null;
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
    private casasService: CasasService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private toastr: ToastrService,
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

  postIniciarVistaFormulario(propiedad: string) { // accion NUEVO
    switch (propiedad) {
      case LS.TAG_APARTAMENTO:
        if (this.accion === LS.ACCION_CONSULTAR) {
          this.tituloForm = LS.TITULO_FORM_CONSULTAR_VENTA;
        } else if (this.accion === LS.ACCION_NUEVO){
          this.tituloForm = LS.TITULO_FORM_NUEVO_APARTAMENTO;
          this.parametroFormulario = {
            accion: this.accion,
            idCasa: null
          }
        }
        break;
      case LS.TAG_CASA:
        if (this.accion === LS.ACCION_CONSULTAR) {
          this.tituloForm = LS.TITULO_FORM_CONSULTAR_VENTA;
          this.traerParaEdicion(this.parametrosFormulario.ventaSeleccionado.id)
        } else if (this.accion === LS.ACCION_NUEVO) {
          this.tituloForm = LS.TITULO_FORM_NUEVA_CASA;
          this.parametroFormulario = {
            accion: this.accion,
            idCasa: null
          }
        }
        
        break;
      case LS.TAG_COCHERA:
        this.tituloForm = LS.TITULO_FORM_NUEVA_COCHERA;
        break;
      case LS.TAG_LOCAL:
        this.tituloForm = LS.TITULO_FORM_NUEVO_LOCAL;
        break;
      case LS.TAG_LOTE:
        this.tituloForm = LS.TITULO_FORM_NUEVO_LOTE;
        break;
      default:
        break;
    }
  }

  traerParaEdicion(id) {
    this.cargando = true;
    this.ventaService.mostrarVenta(id, this);
  }

  despuesDeMostrarVenta(data) {
    this.venta = this.convertirVentaDTOaVenta(data);
    this.cliente = data.cliente;
    if (this.venta.apartamento_id) {
      //
    } else if (this.venta.casa_id) {
      this.propiedad = data.casa_id;
      this.codigo = data.casa_id.codigo;
      this.parametroFormulario = {
        accion: this.accion,
        casa: data.casa_id
      }
    } else if (this.venta.cochera_id) {
      //
    } else if (this.venta.local_id) {
      //
    } else if (this.venta.lote_id) {
      //
    }
    
    this.cargando = false;
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

  buscarPropiedad() {
    switch (this.tipopropiedad) {
      case LS.TAG_APARTAMENTO:
        break;
      case LS.TAG_CASA:
        this.buscarCasas();
        break;
      case LS.TAG_COCHERA:
        break;
      case LS.TAG_LOCAL:
        break;
      case LS.TAG_LOTE:
        break;
      default:
        break;
    }
  }

  // CASA
  buscarCasas() {
    const modalRef = this.modalService.open(CasasListadoComponent, {size: 'lg', keyboard: true });
    let parametros = {
      codigo: this.codigo,
      contrato: 'V',
      ubigeo: this.ubigeo
    }
    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.parametrosBusqueda = parametros;
    modalRef.result.then((result) => {
      this.propiedad = result;
      this.codigo = result.codigo; // result es casaTO
      this.venta.casa_id = result.id;
      // para consultar y editar en modal casa
      this.cargando = true;
      this.casasService.mostrarCasa(this.venta.casa_id, this);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      // this.auth.agregarmodalopenclass();
    });
  }

  despuesDeMostrarCasa(data) {
    this.cargando = false;
    this.parametroFormulario = {
      accion: LS.ACCION_CONSULTAR,
      casa: data
    }
  }
  // END CASA

  buscarcliente() {
    const modalRef = this.modalService.open(ModalPersonaComponent, {size: 'lg', keyboard: true});
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
    // this.setearValoresRhBonoMotivo();
    this.cargando = true;
    console.log(this.utilService.obtenerFechaActual());
    console.log(new Date(this.utilService.obtenerFechaActual()));
    this.venta.fecha = this.utilService.obtenerFechaActual();
    console.log(this.venta.fecha);
    console.log('Venta antes de ingresar');
    console.log(this.venta);
    this.ventaService.ingresarVenta(this.venta, this);
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
    return this.ventaTO;
  }

  cambiarActivar(estado) {
    this.activar = !estado;
    this.enviarActivar.emit(estado);
  }

  cancelar() {
    let parametros = {
      accion : this.accion,
      ventaTO: this.ventaTO
    }
    this.enviarAccion.emit(parametros);
  }
}
