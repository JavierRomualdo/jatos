import { Component, OnInit } from '@angular/core';
import { CocheraMensaje } from 'src/app/entidades/entidad.cocheramensaje';
import { Cochera } from 'src/app/entidades/entidad.cochera';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/servicios/auth.service';
import { Persona } from 'src/app/entidades/entidad.persona';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { ModalCocheraComponent } from './modal-cochera/modal-cochera.component';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { CocheraService } from './cochera.service';

@Component({
  selector: 'app-cocheras',
  templateUrl: './cocheras.component.html',
  styleUrls: ['./cocheras.component.css']
})
export class CocherasComponent implements OnInit {

  public cargando: Boolean = false;
  public vermensajes: Boolean = false;
  public estadomensajes: Boolean = true;
  public confirmarcambioestado: Boolean = false;
  public cocheras: any = []; // lista proyecto
  public cochera_id: number;
  public mensajes: CocheraMensaje[];
  public parametros: Cochera;
  errors: Array<Object> = [];

  constructor(
    private modalService: NgbModal,
    private api: ApiRequest2Service,
    private cocheraService: CocheraService,
    private toastr: ToastrService,
  ) {
    this.parametros = new Cochera();
    this.mensajes = [];
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
  }

  ngOnInit() {
    this.listarCocheras();
  }

  limpiar() {
    this.parametros = new Cochera();
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
    this.cocheras = [];
    this.listarCocheras();
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
      this.cocheraService.busquedaCocheras(this.parametros, this);
    } else {
      this.toastr.info('Ingrese datos');
    }
  }

  despuesDeBusquedaCocheras(data) {
    console.log(data);
    this.cocheras = data;
    this.cargando = false;
  }

  abrirCocheras(): void {
    const modalRef = this.modalService.open(ModalCocheraComponent, {size: 'lg', keyboard: false});
    modalRef.result.then((result) => {
      this.listarCocheras();
    }, (reason) => {
    });
  }

  editarCochera(id) {
    const modalRef = this.modalService.open(ModalCocheraComponent, {size: 'lg', keyboard: false});
    modalRef.componentInstance.edit = id;
    modalRef.result.then((result) => {
      this.listarCocheras();
    }, (reason) => {
    });
  }

  confirmarcambiodeestado(cochera): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoservicio(cochera);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      cochera.estado = !cochera.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoservicio(cochera) {
    this.cargando = true;
    this.cocheraService.cambiarEstadoCochera(cochera.id, this);
  }

  despuesDeCambiarEstadoCochera(data) {
    console.log(data);
    this.listarCocheras();
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

  listarCocheras() {
    this.cargando = true;
    this.cocheraService.listarCocheras(this);
  }

  despuesDeListarCocheras(data) {
    this.cocheras = data;
    this.cargando = false;
    console.log('resultado: ');
    console.log(this.cocheras);
  }

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
    this.listarCocheras();
  }
}
