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
  public apartamentos: any = []; // lista proyecto
  // tslint:disable-next-line:no-inferrable-types
  public apartamento_id: number;
  public mensajes: ApartamentoMensaje[];
  public parametros: Apartamento;
  errors: Array<Object> = [];

  constructor(
    private modalService: NgbModal,
    private api: ApiRequest2Service,
    private apartamentoService: ApartamentoService,
    private toastr: ToastrService,
  ) {
    this.parametros = new Apartamento();
    this.mensajes = [];
    this.parametros.ubigeo_id = new Ubigeo();
  }

  ngOnInit() {
    this.listarApartamentos();
  }

  limpiar() {
    this.parametros = new Apartamento();
    this.parametros.ubigeo_id = new Ubigeo();
    this.apartamentos = [];
    this.listarApartamentos();
  }

  busqueda() {
    let nohayvacios: Boolean = false;
    if (this.parametros.ubigeo_id.ubigeo !== undefined && this.parametros.ubigeo_id.ubigeo !== '') {
      // this.toastr.info('Hay servicio datos: ' + this.parametros.servicio);
      nohayvacios = true;
    }
    if (this.parametros.direccion !== undefined && this.parametros.direccion !== '') {
      // this.toastr.info('Hay detalle datos: ' + this.parametros.detalle);
      nohayvacios = true;
    }
    if (nohayvacios) {
      this.cargando = true;
      console.log(this.parametros);
      this.apartamentoService.busquedaApartamentos(this.parametros, this);
    } else {
      this.toastr.info('Ingrese datos');
    }
  }

  despuesDeBusquedaApartamentos(data) {
    console.log(data);
    this.apartamentos = data;
    this.cargando = false;
  }

  abrirApartamentos(): void {
    const modalRef = this.modalService.open(ModalApartamentoComponent, {size: 'lg', keyboard: false});
    modalRef.result.then((result) => {
      this.listarApartamentos();
    }, (reason) => {
    });
  }

  editarApartamento(id) {
    const modalRef = this.modalService.open(ModalApartamentoComponent, {size: 'lg', keyboard: false});
    modalRef.componentInstance.edit = id;
    modalRef.result.then((result) => {
      this.listarApartamentos();
    }, (reason) => {
    });
  }

  confirmarcambiodeestado(apartamento): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoservicio(apartamento);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      apartamento.estado = !apartamento.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoservicio(apartamento) {
    this.cargando = true;
    this.apartamentoService.cambiarEstadoApartamento(apartamento.id, this);
  }

  despuesDeCambiarEstadoApartamento(data) {
    console.log(data);
    this.listarApartamentos();
    this.cargando = false;
  }

  confirmarcambiodeestadomensaje(mensaje): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.confirmarmensajeleido(mensaje);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      mensaje.estado = !mensaje.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  confirmarmensajeleido(mensaje) {
    // this.cargando = true;
    this.apartamentoService.cambiarEstadoMensajeApartamento(mensaje.id, this);
  }

  despuesCambiarEstadoMensajeApartamento(data) {
    console.log(data);
    this.listarmensajes(this.apartamento_id, this.estadomensajes);
    // this.cargando = false;
  }

  listarApartamentos() {
    this.cargando = true;
    this.apartamentoService.listarApartamentos(this);
  }

  despuesDeListarApartamentos(data) {
    this.apartamentos = data;
    this.cargando = false;
    console.log('resultado: ');
    console.log(this.apartamentos);
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
    this.listarApartamentos();
  }

  private handleError(error: any): void {
    this.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }

}
