import { Component, OnInit } from '@angular/core';
import { Local } from 'src/app/entidades/entidad.local';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { Persona } from 'src/app/entidades/entidad.persona';
import { ModalLocalComponent } from './modal-local/modal-local.component';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { LocalService } from './local.service';
import { LS } from 'src/app/contantes/app-constants';
import { MenuItem } from 'primeng/api';
import { UtilService } from 'src/app/servicios/util/util.service';

@Component({
  selector: 'app-locales',
  templateUrl: './locales.component.html',
  styleUrls: ['./locales.component.css']
})
export class LocalesComponent implements OnInit {

  public cargando: Boolean = false;
  public confirmarcambioestado: Boolean = false;
  public locales: any = []; // lista locales
  public parametros: Local;
  public parametrosListado: any = {};
  public activar: boolean = false;
  public constantes: any = LS;

  public items: MenuItem[];

  constructor(
    private modalService: NgbModal,
    private localService: LocalService,
    private utilService: UtilService,
  ) {
    this.parametros = new Local();
    this.parametros.ubigeo_id = new Ubigeo();
    this.parametros.persona_id = new Persona();
  }

  ngOnInit() {
    this.listarLocales(true);
    this.items = this.utilService.generarItemsMenuesPropiedades(this, 'V');
  }

  // proviene del menu
  nuevo() {
    let parametros = {
      accion: LS.ACCION_NUEVO,
      objetoSeleccionado: null
    }
    this.abrirLocales(parametros);
  }

  limpiar() {
    this.parametros = new Local();
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
    this.parametrosListado = {};
    this.parametrosListado.listar = false;
    this.locales = [];
    this.listarLocales(true);
  }

  consultarGeneral(activos: boolean) {
    this.listarLocales(activos);
  }

  consultarEstadoContrato(estadoContrato: string) {
    this.parametrosListado = {
      listar: true,
      activos: true,
      estadoContrato: estadoContrato
    };
  }

  abrirLocales(parametros): void {
    const modalRef = this.modalService.open(ModalLocalComponent, {size: 'lg', keyboard: false});
    modalRef.componentInstance.parametros = parametros;
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((data) => {
      console.log('se cerro modal propiedades');
      this.refrescarTabla(parametros.accion, data);
      // this.listarLocales();
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

  confirmarcambiodeestado(local): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cargando = true;
      this.localService.cambiarEstadoLocal(local.id, this);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      local.estado = !local.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  despuesDeCambiarEstadoLocal(data) {
    console.log(data);
    this.listarLocales(true);
    this.cargando = false;
  }

  listarLocales(activos: boolean) {
    this.parametrosListado = {
      listar: true,
      activos: activos,
      estadoContrato: null
    };
  }

  ejecutarAccion(parametros) {
    this.abrirLocales(parametros);
  }
}
