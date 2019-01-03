import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Casa } from 'src/app/entidades/entidad.casa';
import { CasaMensaje } from 'src/app/entidades/entidad.casamensaje';
import { Persona } from 'src/app/entidades/entidad.persona';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { ModalCasaComponent } from './modal-casa/modal-casa.component';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { CasasService } from './casas.service';
import { MenuItem } from 'primeng/api';
import { UtilService } from 'src/app/servicios/util/util.service';
import { LS } from 'src/app/contantes/app-constants';

@Component({
  selector: 'app-casas',
  templateUrl: './casas.component.html',
  styleUrls: ['./casas.component.css']
})
export class CasasComponent implements OnInit {

  public cargando: Boolean = false;
  public vermensajes: Boolean = false;
  public estadomensajes: Boolean = true;
  public confirmarcambioestado: Boolean = false;
  public casas: Array<any> = []; // lista casas
  public casa_id: number;
  public mensajes: CasaMensaje[];
  public parametros: Casa;
  public parametrosListado: any = {};
  public activar: boolean = false;
  public constantes: any = LS;

  public items: MenuItem[];
  constructor(
    private modalService: NgbModal,
    private casasService: CasasService,
    private utilService: UtilService,
  ) {
    this.parametros = new Casa();
    this.mensajes = [];
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
  }

  ngOnInit() {
    this.listarPropiedades(true);
    this.items = this.utilService.generarItemsMenuesPropiedades(this, 'V');
  }

  // proviene del menu
  nuevo() {
    let parametros = {
      accion: LS.ACCION_NUEVO,
      objetoSeleccionado: null
    }
    this.abrirPropiedades(parametros);
  }

  limpiar() {
    this.parametros = new Casa();
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
    this.parametrosListado = {};
    this.parametrosListado.listar = false;
    this.casas = [];
    this.listarPropiedades(true);
  }

  consultarGeneral(activos: boolean) {
    this.listarPropiedades(activos);
  }

  consultarEstadoContrato(estadoContrato: string) {
    this.parametrosListado = {
      listar: true,
      activos: true,
      estadoContrato: estadoContrato
    };
  }

  abrirPropiedades(parametros): void {
    const modalRef = this.modalService.open(ModalCasaComponent, {size: 'lg', keyboard: false});
    modalRef.componentInstance.parametros = parametros;
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((data) => {
      console.log('se cerro modal propiedades');
      this.refrescarTabla(parametros.accion, data);
      // this.listarPropiedades(true);
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

  confirmarcambiodeestado(casa): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.casasService.cambiarEstadoCasa(casa.id, this);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      casa.estado = !casa.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  despuesCambiarEstadoCasa(data) {
    this.listarPropiedades(true);
    this.cargando = false;
  }

  confirmarcambiodeestadomensaje(mensaje): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.casasService.cambiarEstadoMensajeCasa(mensaje.id, this);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      mensaje.estado = !mensaje.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  despuesCambiarEstadoMensajeCasa(data) {
    this.cargando = false;
    this.listarmensajes(this.casa_id, this.estadomensajes);
  }

  listarPropiedades(activos: boolean) {
    this.parametrosListado = {
      listar: true,
      activos: activos,
      estadoContrato: null
    };
  }

  ejecutarAccion(parametros) {
    this.abrirPropiedades(parametros);
  }

  listarmensajes(casa_id, estado) {
    this.estadomensajes = estado;
    let valor = 1;
    if (estado === false) {
      valor = 0;
    }
    this.cargando = true;
    this.vermensajes = true;
    this.casa_id = casa_id;
    let parametros = {casa_id: casa_id, valor: valor}
    this.casasService.listarMensajesCasa(parametros, this);
  }

  despuesDeListarMensajesCasa(data) {
    this.mensajes = data;
    this.cargando = false;
  }

  cerrarmensajes() {
    this.vermensajes = false;
    this.listarPropiedades(true);
  }
}
