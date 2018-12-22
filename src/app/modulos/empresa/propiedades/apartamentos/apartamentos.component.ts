import { Component, OnInit } from '@angular/core';
import { ApartamentoMensaje } from 'src/app/entidades/entidad.apartamentomensaje';
import { Apartamento } from 'src/app/entidades/entidad.apartamento';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { ModalApartamentoComponent } from './modal-apartamento/modal-apartamento.component';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { ApartamentoService } from './apartamento.service';
import { LS } from 'src/app/contantes/app-constants';
import { MenuItem } from 'primeng/api';
import { UtilService } from 'src/app/servicios/util/util.service';

@Component({
  selector: 'app-apartamentos',
  templateUrl: './apartamentos.component.html',
  styleUrls: ['./apartamentos.component.css']
})
export class ApartamentosComponent implements OnInit {

  public cargando: Boolean = false;
  public vermensajes: Boolean = false;
  public estadomensajes: Boolean = true;
  public confirmarcambioestado: Boolean = false;
  public apartamentos: any = []; // lista apartamentos
  // tslint:disable-next-line:no-inferrable-types
  public apartamento_id: number;
  public mensajes: ApartamentoMensaje[];
  public parametros: Apartamento;
  public parametrosListado: any = {};
  public activar: boolean = false;
  public constantes: any = LS;

  public items: MenuItem[];
  constructor(
    private modalService: NgbModal,
    private apartamentoService: ApartamentoService,
    private utilService: UtilService,
  ) {
    this.parametros = new Apartamento();
    this.mensajes = [];
    this.parametros.ubigeo_id = new Ubigeo();
  }

  ngOnInit() {
    this.listarApartamentos(true);
    this.items = this.utilService.generarItemsMenuesPropiedades(this);
  }

  // proviene del menu
  nuevo() {
    let parametros = {
      accion: LS.ACCION_NUEVO,
      objetoSeleccionado: null
    }
    this.abrirApartamentos(parametros);
  }

  limpiar() {
    this.parametros = new Apartamento();
    this.parametros.ubigeo_id = new Ubigeo();
    this.parametrosListado = {};
    this.parametrosListado.listar = false;
    this.apartamentos = [];
    this.listarApartamentos(true);
  }

  consultarGeneral(activos: boolean) {
    this.listarApartamentos(activos);
  }

  consultarEstadoContrato(estadoContrato: string) {
    this.parametrosListado = {
      listar: true,
      activos: true,
      estadoContrato: estadoContrato
    };
  }

  abrirApartamentos(parametros): void {
    const modalRef = this.modalService.open(ModalApartamentoComponent, {size: 'lg', keyboard: false});
    modalRef.componentInstance.parametros = parametros;
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((data) => {
      console.log('se cerro modal propiedades');
      this.refrescarTabla(parametros.accion, data);
      // this.listarApartamentos();
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

  confirmarcambiodeestado(apartamento): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cargando = true;
      this.apartamentoService.cambiarEstadoApartamento(apartamento.id, this);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      apartamento.estado = !apartamento.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  despuesDeCambiarEstadoApartamento(data) {
    console.log(data);
    this.listarApartamentos(true);
    this.cargando = false;
  }

  confirmarcambiodeestadomensaje(mensaje): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cargando = true;
      this.apartamentoService.cambiarEstadoMensajeApartamento(mensaje.id, this);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      mensaje.estado = !mensaje.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  despuesCambiarEstadoMensajeApartamento(data) {
    console.log(data);
    this.listarmensajes(this.apartamento_id, this.estadomensajes);
    // this.cargando = false;
  }

  listarApartamentos(activos: boolean) {
    this.parametrosListado = {
      listar: true,
      activos: activos,
      estadoContrato: null
    };
  }

  ejecutarAccion(parametros) {
    this.abrirApartamentos(parametros);
  }

  listarmensajes(apartamento_id, estado) {
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
    this.apartamento_id = apartamento_id;
    let parametros = {apartamento_id: apartamento_id, valor: valor};
    this.apartamentoService.listarMensajesApartamento(parametros, this)
  }

  despuesDeListarMensajesApartamento(data) {
    this.mensajes = data;
    this.cargando = false;
    console.log('resultado: ');
    console.log(this.mensajes);
  }

  private mostrarApartamentoCuarto(apartamentoid) {
    const modalRef = this.modalService.open(ModalApartamentoComponent, {size: 'lg', keyboard: false});
    modalRef.componentInstance.apartamentoid = apartamentoid;
    modalRef.result.then((result) => {
      // this.listarApartamentos();
    }, (reason) => {
    });
  }

  private cerrarmensajes() {
    this.vermensajes = false;
    this.listarApartamentos(true);
  }
}
