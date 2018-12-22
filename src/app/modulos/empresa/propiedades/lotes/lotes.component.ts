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
  public confirmarcambioestado: Boolean = false;
  public lotes: any = []; // lista lotes
  public parametros: Lote;
  public parametrosListado: any = {};
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
    this.items = this.utilService.generarItemsMenuesPropiedades(this);
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
    this.parametrosListado.listar = false;
    this.lotes = [];
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
    this.abrirLotes(parametros);
  }
}
