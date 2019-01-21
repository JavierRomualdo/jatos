import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { LS } from 'src/app/contantes/app-constants';
import { Alquiler } from 'src/app/entidades/entidad.alquiler';
import { AlquilerTO } from 'src/app/entidadesTO/empresa/AlquilerTO';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { Persona } from 'src/app/entidades/entidad.persona';
import { AlquilerService } from '../../alquileres/alquiler.service';
import { ApartamentoService } from '../../propiedades/apartamentos/apartamento.service';
import { CasasService } from '../../propiedades/casas/casas.service';
import { CocheraService } from '../../propiedades/cocheras/cochera.service';
import { LocalService } from '../../propiedades/locales/local.service';
import { LoteService } from '../../propiedades/lotes/lote.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from 'src/app/servicios/util/util.service';
import { LotesListadoComponent } from '../lotes-listado/lotes-listado.component';
import { LocalesListadoComponent } from '../locales-listado/locales-listado.component';
import { CocherasListadoComponent } from '../cocheras-listado/cocheras-listado.component';
import { CasasListadoComponent } from '../casas-listado/casas-listado.component';
import { ApartamentosListadoComponent } from '../apartamentos-listado/apartamentos-listado.component';
import { HabitacionesListadoComponent } from '../habitaciones-listado/habitaciones-listado.component';
import { HabitacionService } from '../../propiedades/habitaciones/habitacion.service';
import { PersonasComponent } from '../../configuracion/personas/personas.component';

@Component({
  selector: 'app-alquiler-formulario',
  templateUrl: './alquiler-formulario.component.html',
  styleUrls: ['./alquiler-formulario.component.css']
})
export class AlquilerFormularioComponent implements OnInit {

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
  public alquiler: Alquiler = new Alquiler();
  public alquilerTO: AlquilerTO = new AlquilerTO();
  public tipopropiedad: string = null;

  // propiedad
  public propiedad: any = null;
  public codigo: string = "";
  public ubigeo: Ubigeo = new Ubigeo();
  // cliente
  public cliente: Persona;
  public fechadesde: Date = new Date();
  public fechahasta: Date = new Date();
  public fechaactual: Date = new Date();
  // parametro formulario propiedad
  public parametroFormulario: any = null;

  constructor(
    private alquilerService: AlquilerService,
    private apartamentoService: ApartamentoService,
    private casasService: CasasService,
    private cocheraService: CocheraService,
    private habitacionService: HabitacionService,
    private localService: LocalService,
    private loteService: LoteService,
    private modalService: NgbModal,
    private utilService: UtilService,
  ) { }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.es = this.utilService.setLocaleDate();
    moment.locale('es'); // para la fecha
    this.es = this.utilService.setLocaleDate();
    // this.fechahasta = this.utilService.setLocaleDate();
    this.cliente = new Persona();
  }

  ngOnChanges(changes) {
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    if (changes.parametrosFormulario) {
      if (changes.parametrosFormulario.currentValue) {
        this.accion = this.parametrosFormulario.accion;
        this.tipopropiedad = this.parametrosFormulario.propiedad;
        this.ubigeo = this.parametrosFormulario.ubigeo;
        // this.fechahasta = this.utilService.setLocaleDate();
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
          this.tituloForm = LS.TITULO_FORM_CONSULTAR_ALQUILER;
          this.traerParaEdicion(this.parametrosFormulario.alquilerSeleccionado.id);
        } else if (this.accion === LS.ACCION_NUEVO){
          this.tituloForm = LS.TITULO_FORM_NUEVO_ALQUILER;
          this.parametroFormulario = {
            accion: this.accion,
            apartamento: null
          }
        }
        break;
      case LS.TAG_CASA:
        // PARA CASA
        if (this.accion === LS.ACCION_CONSULTAR) {
          this.tituloForm = LS.TITULO_FORM_CONSULTAR_ALQUILER;
          this.traerParaEdicion(this.parametrosFormulario.alquilerSeleccionado.id);
        } else if (this.accion === LS.ACCION_NUEVO) {
          this.tituloForm = LS.TITULO_FORM_NUEVO_ALQUILER;
          this.parametroFormulario = {
            accion: this.accion,
            casa: null
          }
        }
        break;
      case LS.TAG_COCHERA:
        // PARA COCHERA
        if (this.accion === LS.ACCION_CONSULTAR) {
          this.tituloForm = LS.TITULO_FORM_CONSULTAR_ALQUILER;
          this.traerParaEdicion(this.parametrosFormulario.alquilerSeleccionado.id)
        } else if (this.accion === LS.ACCION_NUEVO) {
          this.tituloForm = LS.TITULO_FORM_NUEVO_ALQUILER;
          this.parametroFormulario = {
            accion: this.accion,
            cochera: null
          }
        }
        break;
      case LS.TAG_HABITACION:
        // PARA HABITACION
        if (this.accion === LS.ACCION_CONSULTAR) {
          this.tituloForm = LS.TITULO_FORM_CONSULTAR_ALQUILER;
          this.traerParaEdicion(this.parametrosFormulario.alquilerSeleccionado.id)
        } else if (this.accion === LS.ACCION_NUEVO) {
          this.tituloForm = LS.TITULO_FORM_NUEVO_ALQUILER;
          this.parametroFormulario = {
            accion: this.accion,
            habitacion: null
          }
        }
        break;
      case LS.TAG_LOCAL:
        // PARA LOCAL
        if (this.accion === LS.ACCION_CONSULTAR) {
          this.tituloForm = LS.TITULO_FORM_CONSULTAR_ALQUILER;
          this.traerParaEdicion(this.parametrosFormulario.alquilerSeleccionado.id)
        } else if (this.accion === LS.ACCION_NUEVO) {
          this.tituloForm = LS.TITULO_FORM_NUEVO_ALQUILER;
          this.parametroFormulario = {
            accion: this.accion,
            local: null
          }
        }
        break;
      case LS.TAG_LOTE:
        // PARA LOTE
        if (this.accion === LS.ACCION_CONSULTAR) {
          this.tituloForm = LS.TITULO_FORM_CONSULTAR_ALQUILER;
          this.traerParaEdicion(this.parametrosFormulario.alquilerSeleccionado.id)
        } else if (this.accion === LS.ACCION_NUEVO) {
          this.tituloForm = LS.TITULO_FORM_NUEVO_ALQUILER;
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
    // consulto la alquiler (traigo los datos de la alquiler en un dto "AlquilerDto")
    this.cargando = true;
    this.alquilerService.mostrarAlquiler(id, this);
  }

  despuesDeMostrarAlquiler(data) {
    // aca mostramos los datos del dto en el formulario
    this.alquiler = this.convertirAlquilerDTOaAlquiler(data);
    this.cliente = data.cliente;
    this.mostrarPropiedadEnFormulario(this.alquiler, data);
    this.cargando = false;
  }

  mostrarPropiedadEnFormulario(alquiler: Alquiler, alquilerDto) {
    this.fechahasta = new Date(alquilerDto.fechahasta);
    this.fechadesde = new Date(alquilerDto.fechadesde);
    switch (this.tipopropiedad) {
      case LS.TAG_APARTAMENTO:
        // MOSTRAR APARTAMENTO
        this.propiedad = alquilerDto.apartamento_id;
        this.codigo = alquilerDto.apartamento_id.codigo;
        this.parametroFormulario = {
          accion: this.accion,
          apartamento: alquilerDto.apartamento_id // apartamento_id es el dtoApartamento
        }
        break;
      case LS.TAG_CASA:
        // MOSTRAR CASA
        this.propiedad = alquilerDto.casa_id;
        this.codigo = alquilerDto.casa_id.codigo;
        this.parametroFormulario = {
          accion: this.accion,
          casa: alquilerDto.casa_id // casa_id es el dtoCasa
        }
        break;
      case LS.TAG_COCHERA:
        // MOSTRAR COCHERA
        this.propiedad = alquilerDto.cochera_id;
        this.codigo = alquilerDto.cochera_id.codigo;
        this.parametroFormulario = {
          accion: this.accion,
          cochera: alquilerDto.cochera_id // cochera_id es el dtoCochera
        }
        break;
      case LS.TAG_HABITACION:
        // MOSTRAR HABITCION
        this.propiedad = alquilerDto.habitacion_id;
        this.codigo = alquilerDto.habitacion_id.codigo;
        this.parametroFormulario = {
          accion: this.accion,
          habitacion: alquilerDto.habitacion_id // habitacion_id es el dtoCochera
        }
        break;
      case LS.TAG_LOCAL:
        // MOSTRAR LOCAL
        this.propiedad = alquilerDto.local_id;
        this.codigo = alquilerDto.local_id.codigo;
        this.parametroFormulario = {
          accion: this.accion,
          local: alquilerDto.local_id // local_id es el dtoLocal
        }
        break;
      case LS.TAG_LOTE:
        // MOSTRAR LOTE
        this.propiedad = alquilerDto.lote_id;
        this.codigo = alquilerDto.lote_id.codigo;
        this.parametroFormulario = {
          accion: this.accion,
          lote: alquilerDto.lote_id // lote_id es el dtoLocal
        }
        break;
      default:
        break;
    }
  }

  convertirAlquilerDTOaAlquiler(data): Alquiler {
    let alquiler = new Alquiler();
    alquiler.id = data.id;
    alquiler.apartamento_id = data.apartamento_id ? data.apartamento_id.id : null;
    alquiler.casa_id = data.casa_id ? data.casa_id.id : null;
    alquiler.cochera_id = data.cochera_id ? data.cochera_id.id : null;
    alquiler.local_id = data.local_id ? data.local_id.id : null;
    alquiler.lote_id = data.lote_id ? data.lote_id.id : null;
    return alquiler;
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
      case LS.TAG_HABITACION:
        this.buscarHabitacion();
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
      codigo: this.codigo,
      contrato: 'A',
      ubigeo: this.ubigeo
    }
    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.parametrosBusqueda = parametros;
    modalRef.result.then((result) => {
      this.propiedad = result;
      this.codigo = result.codigo; // result es casaTO
      this.alquiler.apartamento_id = result.id;
      // para consultar y editar en modal casa
      this.cargando = true;
      this.apartamentoService.mostrarApartamento(this.alquiler.apartamento_id, this);
      // this.auth.agregarmodalopenclass();
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
      codigo: this.codigo,
      contrato: 'A',
      ubigeo: this.ubigeo
    }
    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.parametrosBusqueda = parametros;
    modalRef.result.then((result) => {
      this.propiedad = result;
      this.codigo = result.codigo; // result es casaTO
      this.alquiler.casa_id = result.id;
      // para consultar y editar en modal casa
      this.cargando = true;
      this.casasService.mostrarCasa(this.alquiler.casa_id, this);
      // this.auth.agregarmodalopenclass();
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
      codigo: this.codigo,
      contrato: 'A',
      ubigeo: this.ubigeo
    }
    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.parametrosBusqueda = parametros;
    modalRef.result.then((result) => {
      this.propiedad = result;
      this.codigo = result.codigo; // result es casaTO
      this.alquiler.cochera_id = result.id;
      // para consultar y editar en modal casa
      this.cargando = true;
      this.cocheraService.mostrarCochera(this.alquiler.cochera_id, this);
      // this.auth.agregarmodalopenclass();
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

  // HABITACION
  buscarHabitacion() {
    const modalRef = this.modalService.open(HabitacionesListadoComponent, {size: 'lg', keyboard: true });
    let parametros = {
      codigo: this.codigo,
      contrato: 'A',
      ubigeo: this.ubigeo
    }
    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.parametrosBusqueda = parametros;
    modalRef.result.then((result) => {
      this.propiedad = result;
      this.codigo = result.codigo; // result es habitacionTO
      this.alquiler.habitacion_id = result.id;
      console.log('datos alq');
      console.log(this.alquiler);
      // para consultar y editar en modal casa
      this.cargando = true;
      this.habitacionService.mostrarHabitacion(this.alquiler.habitacion_id, this);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      // this.auth.agregarmodalopenclass();
    });
  }

  despuesDeMostrarHabitacion(data) { // el dtoCochera
    this.cargando = false;
    this.parametroFormulario = {
      accion: LS.ACCION_CONSULTAR,
      habitacion: data
    }
  }

  // LOCAL
  buscaLocal() {
    const modalRef = this.modalService.open(LocalesListadoComponent, {size: 'lg', keyboard: true });
    let parametros = {
      codigo: this.codigo,
      contrato: 'A',
      ubigeo: this.ubigeo
    }
    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.parametrosBusqueda = parametros;
    modalRef.result.then((result) => {
      this.propiedad = result;
      this.codigo = result.codigo; // result es casaTO
      this.alquiler.local_id = result.id;
      // para consultar y editar en modal casa
      this.cargando = true;
      this.localService.mostrarLocal(this.alquiler.local_id, this);
      // this.auth.agregarmodalopenclass();
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
      codigo: this.codigo,
      contrato: 'A',
      ubigeo: this.ubigeo
    }
    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.parametrosBusqueda = parametros;
    modalRef.result.then((result) => {
      this.propiedad = result;
      this.codigo = result.codigo; // result es casaTO
      this.alquiler.lote_id = result.id;
      // para consultar y editar en modal casa
      this.cargando = true;
      this.loteService.mostrarLote(this.alquiler.lote_id, this);
      // this.auth.agregarmodalopenclass();
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
      this.alquiler.persona_id = result.id;
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      // this.auth.agregarmodalopenclass();
    });
  }

  insertarAlquiler() {
    // this.setearValoresRhBonoMotivo();
    this.cargando = true;
    console.log(this.utilService.obtenerFechaActual());
    console.log(new Date(this.utilService.obtenerFechaActual()));
    console.log('fecha hasta');
    console.log(this.fechahasta);
    this.alquiler.fechadesde = this.utilService.formatearDateToStringYYYYMMDD(this.fechadesde);
    this.alquiler.fechahasta = this.utilService.formatearDateToStringYYYYMMDD(this.fechahasta);
    console.log(this.alquiler.fechadesde);
    console.log('Alquiler antes de ingresar');
    console.log(this.alquiler);
    this.alquilerService.ingresarAlquiler(this.alquiler, this);
  }

  despuesDeIngresarAlquiler(data) {
    this.cargando = false;
    let alquilerTO = this.convertirAlquilerAAlquilerTO(data);
    let parametros = {
      accion : this.accion,
      alquilerTO: alquilerTO
    }
    console.log('despues de insertar alquiler');
    console.log(parametros);
    this.enviarAccion.emit(parametros);
  }

  convertirAlquilerAAlquilerTO(data): AlquilerTO {
    let alquilerTO = new AlquilerTO();
    alquilerTO.id = data.id;
    alquilerTO.estadocontrato = 'A';
    alquilerTO.foto = this.propiedad.foto
    alquilerTO.propiedad_id = this.propiedad.id;
    alquilerTO.propiedad_codigo = this.propiedad.codigo;
    alquilerTO.propietario = this.propiedad.propietario;
    alquilerTO.cliente = this.cliente.nombres;
    alquilerTO.ubicacion = this.propiedad.ubicacion;
    alquilerTO.direccion = this.propiedad.direccion;
    return this.alquilerTO;
  }

  cambiarActivar(estado) {
    this.activar = !estado;
    this.enviarActivar.emit(estado);
  }

  cancelar() {
    let parametros = {
      accion : this.accion,
      alquilerTO: this.alquilerTO
    }
    this.enviarAccion.emit(parametros);
  }
}
