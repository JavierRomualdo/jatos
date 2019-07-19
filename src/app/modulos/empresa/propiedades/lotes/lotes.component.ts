import { Component, OnInit } from '@angular/core';
import { Lote } from 'src/app/entidades/entidad.lote';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Persona } from 'src/app/entidades/entidad.persona';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { ModalLoteComponent } from './modal-lote/modal-lote.component';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { LoteService } from './lote.service';
import { LS } from 'src/app/contantes/app-constants';
import { UtilService } from 'src/app/servicios/util/util.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.css']
})
export class LotesComponent implements OnInit {

  public cargando: Boolean = false;
  public vermensajes: boolean = false;
  public confirmarcambioestado: Boolean = false;
  public parametros: Lote;
  public parametrosListado: any = null;
  public parametrosMensaje: any = null;
  public activar: boolean = false;
  public constantes: any = LS;
  
  public items: MenuItem[];
  constructor(
    private modalService: NgbModal,
    private loteService: LoteService,
    private utilService: UtilService,
  ) {
    this.parametros = new Lote();
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
  }

  ngOnInit() {
    this.listarLotes(true);
    this.items = this.utilService.generarItemsMenuesPropiedades(this, true, 'V');
  }

  // proviene del menu
  nuevo() {
    let parametros = {
      accion: LS.ACCION_NUEVO,
      objetoSeleccionado: null
    }
    this.abrirLotes(parametros);
  }

  limpiar() {
    this.parametros = new Lote();
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
    this.parametrosListado = {};
    this.parametrosMensaje = {};
    this.parametrosListado.listar = false;
    this.listarLotes(true);
  }

  consultarGeneral(activos: boolean) {
    this.listarLotes(activos);
  }

  consultarEstadoContrato(estadoContrato: string) {
    this.parametrosListado = {
      listar: true,
      activos: true,
      estadoContrato: estadoContrato
    };
  }

  abrirLotes(parametros): void {
    const modalRef = this.modalService.open(ModalLoteComponent, {size: 'lg', keyboard: true});
    modalRef.componentInstance.parametros = parametros;
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((data) => {
      console.log('se cerro modal propiedades');
      this.refrescarTabla(parametros.accion, data);
      // this.listarLotes();
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

  confirmarcambiodeestado(lote): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cargando = true;
      this.loteService.cambiarEstadoLote(lote.id, this);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      lote.estado = !lote.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  despuesDeCambiarEstadoLote(data) {
    console.log(data);
    this.listarLotes(true);
    this.cargando = false;
  }

  listarLotes(activos: boolean) {
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
      this.vermensajes = false;
      this.abrirLotes(parametros);
    }
  }

  // cuando hago click en boton de regresar en listado de mensajes
  ejecutarAccionMensaje(parametros) {
    if (parametros.cerrarListado) {
      this.vermensajes = false;
      this.refrescarTabla(LS.ACCION_EDITAR,parametros.objetoSeleccionado);
      this.items = this.utilService.generarItemsMenuesPropiedades(this, true, 'V');
    }
  }

  verMensajes(parametros) {
    this.vermensajes = true;
    this.items = this.utilService.generarItemsMenuesPropiedades(this, false, 'V');
    // this.items = this.utilService.generarItemsMenuesNotificaciones(this);
    this.parametrosMensaje = parametros;
  }

  // para los mensajes
  consultarNotificaciones(activos: boolean) {}
}
