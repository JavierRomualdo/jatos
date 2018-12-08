import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Casa } from 'src/app/entidades/entidad.casa';
import { CasaMensaje } from 'src/app/entidades/entidad.casamensaje';
import { Persona } from 'src/app/entidades/entidad.persona';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { ModalCasaComponent } from './modal-casa/modal-casa.component';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { CasasService } from './casas.service';

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

  constructor(
    private modalService: NgbModal,
    private casasService: CasasService,
    private toastr: ToastrService,
  ) {
    this.parametros = new Casa();
    this.mensajes = [];
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
  }

  ngOnInit() {
    this.listarPropiedades();
  }

  limpiar() {
    this.parametros = new Casa();
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
    this.casas = [];
    this.listarPropiedades();
  }

  busqueda() {
    let nohayvacios: Boolean = false;
    if (this.parametros.persona_id.nombres !== undefined &&
      this.parametros.persona_id.nombres !== '') {
        nohayvacios = true;
      }
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
      this.casasService.busquedaCasas(this.parametros, this);
    } else {
      this.toastr.warning('Verifique los datos ingresados.', 'Datos inválidos');
    }
  }

  despuesDeBusquedaCasas(data) {
    console.log(data);
    this.casas = data;
    this.cargando = false;
  }

  abrirPropiedades(): void {
    const modalRef = this.modalService.open(ModalCasaComponent, {size: 'lg', keyboard: false});
    modalRef.result.then((result) => {
      this.listarPropiedades();
    }, (reason) => {
    });
  }

  editarPropiedad(id) {
    const modalRef = this.modalService.open(ModalCasaComponent, {size: 'lg', keyboard: false});
    modalRef.componentInstance.edit = id;
    modalRef.result.then((result) => {
      this.listarPropiedades();
    }, (reason) => {
    });
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
    console.log(data);
    this.listarPropiedades();
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

  listarPropiedades() {
    this.cargando = true;
    this.casasService.listarCasas(this);
  }

  despuesDeListarCasas(data) {
    this.casas = data;
    this.cargando = false;
    console.log('resultado: ');
    console.log(this.casas);
  }

  listarmensajes(casa_id, estado) {
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
    this.casa_id = casa_id;
    let parametros = {casa_id: casa_id, valor: valor}
    this.casasService.listarMensajesCasa(parametros, this);
  }

  despuesDeListarMensajesCasa(data) {
    this.mensajes = data;
    this.cargando = false;
    console.log('resultado: ');
    console.log(this.mensajes);
  }

  cerrarmensajes() {
    this.vermensajes = false;
    this.listarPropiedades();
  }
}
