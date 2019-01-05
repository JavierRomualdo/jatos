import { Component, OnInit } from '@angular/core';
import { Habitacion } from 'src/app/entidades/entidad.habitacion';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { Persona } from 'src/app/entidades/entidad.persona';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { ModalHabitacionComponent } from './modal-habitacion/modal-habitacion.component';
import { HabitacionService } from './habitacion.service';
import { HabitacionMensaje } from 'src/app/entidades/entidad.habitacionmensaje';
import { LS } from 'src/app/contantes/app-constants';
import { MenuItem } from 'primeng/api';
import { UtilService } from 'src/app/servicios/util/util.service';

@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css']
})
export class HabitacionesComponent implements OnInit {

  public cargando: Boolean = false;
  public vermensajes: boolean = false;
  public estadomensajes: Boolean = true;
  public confirmarcambioestado: Boolean = false;
  public habitaciones: Array<any> = []; // lista habitaciones
  public habitacion_id: number;
  public mensajes: HabitacionMensaje[];
  public parametros: Habitacion;
  public parametrosListado: any = null;
  public parametrosMensaje: any = null;
  public activar: boolean = false;
  public constantes: any = LS;

  public items: MenuItem[];

  constructor(
    private modalService: NgbModal,
    private habitacionService: HabitacionService,
    private utilService: UtilService,
  ) {
    this.parametros = new Habitacion();
    this.parametros.ubigeo_id = new Ubigeo();
    this.parametros.persona_id = new Persona();
  }

  ngOnInit() {
    this.listarHabitaciones(true);
    this.items = this.utilService.generarItemsMenuesPropiedades(this, true, 'A');
  }

  // proviene del menu
  nuevo() {
    let parametros = {
      accion: LS.ACCION_NUEVO,
      objetoSeleccionado: null
    }
    this.abrirHabitaciones(parametros);
  }

  limpiar() {
    this.parametros = new Habitacion();
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
    this.parametrosListado = {};
    this.parametrosListado.listar = false;
    this.habitaciones = [];
    this.parametrosMensaje = {};
    this.listarHabitaciones(true);
  }

  consultarGeneral(activos: boolean) {
    this.listarHabitaciones(activos);
  }

  consultarEstadoContrato(estadoContrato: string) {
    this.parametrosListado = {
      listar: true,
      activos: true,
      estadoContrato: estadoContrato
    };
  }

  abrirHabitaciones(parametros): void {
    const modalRef = this.modalService.open(ModalHabitacionComponent, {size: 'lg', keyboard: false});
    modalRef.componentInstance.parametros = parametros;
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((data) => {
      console.log('se cerro modal propiedades');
      this.refrescarTabla(parametros.accion, data);
      // this.listarHabitaciones();
    }, (reason) => {
    });
  }

  refrescarTabla(accion: string, data) {
    this.parametrosListado = {
      listar: true,
      accion: accion,
      data: data,
    };
  }

  confirmarcambiodeestado(habitacion): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      // this.cambiarestadoservicio(habitacion);
      this.cargando = true;
      this.habitacionService.cambiarEstadoHabitacion(habitacion.id, this);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      habitacion.estado = !habitacion.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  despuesDeCambiarEstadoHabitacion(data) {
    this.listarHabitaciones(true);
    this.cargando = false;
  }

  listarHabitaciones(activos: boolean) {
    this.parametrosListado = {
      listar: true,
      activos: activos,
      estadoContrato: null
    };
  }

  ejecutarAccion(parametros) {
    if (parametros.verMensajes) {
      this.verMensajes(parametros);
    } else {
      this.parametrosMensaje = null;
      this.vermensajes = false;
      this.abrirHabitaciones(parametros);
    }
  }

  // cuando hago click en boton de regresar en listado de mensajes
  ejecutarAccionMensaje(parametros) {
    if (parametros.cerrarListado) {
      this.parametrosMensaje = null;
      this.vermensajes = false;
      this.items = this.utilService.generarItemsMenuesPropiedades(this, true, 'A');
    }
  }

  verMensajes(parametros) {
    this.vermensajes = true;
    this.items = this.utilService.generarItemsMenuesPropiedades(this, false, 'A');
    // this.items = this.utilService.generarItemsMenuesNotificaciones(this);
    this.parametrosMensaje = parametros;
  }

  // para los mensajes
  consultarNotificaciones(activos: boolean) {}

  listarmensajes(habitacion_id, estado) {
    this.estadomensajes = estado;
    let valor = 1;
    if (estado === false) {
      valor = 0;
    }
    this.cargando = true;
    this.vermensajes = true;
    this.habitacion_id = habitacion_id;
    let parametros = {habitacion_id: habitacion_id, valor: valor}
    this.habitacionService.listarMensajesHabitacion(parametros, this);
  }

  despuesDeListarMensajesCasa(data) {
    this.mensajes = data;
    this.cargando = false;
  }

  cerrarmensajes() {
    this.vermensajes = false;
    this.listarHabitaciones(true);
  }
}
