import { Component, OnInit } from '@angular/core';
import { CocheraMensaje } from 'src/app/entidades/entidad.cocheramensaje';
import { Cochera } from 'src/app/entidades/entidad.cochera';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Persona } from 'src/app/entidades/entidad.persona';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { ModalCocheraComponent } from './modal-cochera/modal-cochera.component';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { CocheraService } from './cochera.service';
import { LS } from 'src/app/contantes/app-constants';
import { UtilService } from 'src/app/servicios/util/util.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-cocheras',
  templateUrl: './cocheras.component.html',
  styleUrls: ['./cocheras.component.css']
})
export class CocherasComponent implements OnInit {

  public cargando: Boolean = false;
  public vermensajes: boolean = false;
  public estadomensajes: Boolean = true;
  public confirmarcambioestado: Boolean = false;
  public cochera_id: number;
  public mensajes: CocheraMensaje[];
  public parametros: Cochera;
  public parametrosListado: any = null;
  public parametrosMensaje: any = null;
  public activar: boolean = false;
  public constantes: any = LS;

  public items: MenuItem[];
  constructor(
    private modalService: NgbModal,
    private cocheraService: CocheraService,
    private utilService: UtilService,
  ) {
    this.parametros = new Cochera();
    this.mensajes = [];
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
  }

  ngOnInit() {
    this.listarCocheras(true);
    this.items = this.utilService.generarItemsMenuesPropiedades(this, true, 'A');
  }

  // proviene del menu
  nuevo() {
    let parametros = {
      accion: LS.ACCION_NUEVO,
      objetoSeleccionado: null
    }
    this.abrirCocheras(parametros);
  }

  limpiar() {
    this.parametros = new Cochera();
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
    this.parametrosListado = {};
    this.parametrosListado.listar = false;
    this.parametrosMensaje = {};
    this.listarCocheras(true);
  }

  consultarGeneral(activos: boolean) {
    this.listarCocheras(activos);
  }

  consultarEstadoContrato(estadoContrato: string) {
    this.parametrosListado = {
      listar: true,
      activos: true,
      estadoContrato: estadoContrato
    };
  }

  abrirCocheras(parametros): void {
    const modalRef = this.modalService.open(ModalCocheraComponent, {size: 'lg', keyboard: false});
    modalRef.componentInstance.parametros = parametros;
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((data) => {
      console.log('se cerro modal propiedades');
      this.refrescarTabla(parametros.accion, data);
      // this.listarCocheras();
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

  confirmarcambiodeestado(cochera): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cargando = true;
      this.cocheraService.cambiarEstadoCochera(cochera.id, this);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      cochera.estado = !cochera.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  despuesCambiarEstadoCasa(data) {
    this.listarCocheras(true);
    this.cargando = false;
  }

  confirmarcambiodeestadomensaje(mensaje): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cocheraService.cambiarEstadoMensajeCochera(mensaje.id, this);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      mensaje.estado = !mensaje.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  despuesCambiarEstadoMensajeCochera(data) {
    console.log(data);
    this.listarmensajes(this.cochera_id, this.estadomensajes);
  }

  listarCocheras(activos: boolean) {
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
      this.abrirCocheras(parametros);
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

  listarmensajes(cochera_id, estado) {
    console.log('estado del mensaje: ');
    console.log(estado);
    this.estadomensajes = estado;
    let valor = 1;
    if (estado === false) {
      valor = 0;
    }
    console.log(valor);
    this.cargando = true;
    this.vermensajes = true;
    this.cochera_id = cochera_id;
    let parametros = {cochera_id: cochera_id, valor: valor}
    this.cocheraService.listarMensajesCochera(parametros, this);
  }

  despuesDeListarMensajesCochera(data) {
    this.mensajes = data;
    this.cargando = false;
    console.log('resultado: ');
    console.log(this.mensajes);
  }

  cerrarmensajes() {
    this.vermensajes = false;
    this.listarCocheras(true);
  }
}
