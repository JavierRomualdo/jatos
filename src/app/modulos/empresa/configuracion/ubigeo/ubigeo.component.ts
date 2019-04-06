import { Component, OnInit } from '@angular/core';
import { UbigeoGuardar } from 'src/app/entidades/entidad.ubigeoguardar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/servicios/auth.service';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { ModalUbigeoComponent } from './modal-ubigeo/modal-ubigeo.component';
import { ModalTipoubigeoComponent } from './modal-tipoubigeo/modal-tipoubigeo.component';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { UbigeoService } from './modal-ubigeo/ubigeo.service';
import { NgForm } from '@angular/forms';
import { UtilService } from 'src/app/servicios/util/util.service';

@Component({
  selector: 'app-ubigeo',
  templateUrl: './ubigeo.component.html',
  styleUrls: ['./ubigeo.component.css']
})
export class UbigeoComponent implements OnInit {

  public cargando: Boolean = false;
  public confirmarcambioestado: Boolean = false;
  public ubigeos: Array<Ubigeo> = [];
  public ubigeosCopia: Array<Ubigeo> = [];
  public parametros: UbigeoGuardar;

  constructor(
    private modalService: NgbModal,
    private ubigeoService: UbigeoService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private auth: AuthService,
  ) {
    this.parametros = new UbigeoGuardar();
  }

  ngOnInit() {
    this.listarUbigeos();
  }

  // Metodos para abrir los modales
  abrirUbigeos() {
    const modalRef = this.modalService.open(ModalUbigeoComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  abrirTipoUbigeos() {
    const modalRef = this.modalService.open(ModalTipoubigeoComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  editarUbigeo(id) {
    const modalRef = this.modalService.open(ModalUbigeoComponent, {size: 'lg', keyboard: true});
    // asi... le pasamos el parametro id del usuario en el modal-usuario
    modalRef.componentInstance.edit = id;
    modalRef.result.then((result) => {
      this.listarUbigeos();
    }, (reason) => {
    });
  }

  listarUbigeos() {
    this.cargando = true;
    this.ubigeoService.litarUbigeos(this);
  }

  despuesDeListarUbigeos(data) {
    this.ubigeos = data;
    this.cargando = false;
  }

  confirmarcambiodeestado(ubigeo): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoservicio(ubigeo);
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      ubigeo.estado = !ubigeo.estado;
      this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoservicio(ubigeo) {
    this.cargando = true;
    this.ubigeoService.cambiarEstadoUbigeo(ubigeo.id, this);
  }

  despuesDeCambiarEstadoUbigeo(data) {
    this.listarUbigeos();
    this.cargando = false;
  }

  limpiar() {
    this.parametros = new UbigeoGuardar();
    this.ubigeos = [];
    this.listarUbigeos();
  }

  busqueda(form: NgForm) {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      this.cargando = true;
      this.ubigeoService.busquedaUbigeos(this.parametros, this);
    } else {
      this.toastr.warning('Verifique los datos ingresados.', 'Datos inválidos');
    }
  }

  despuesDeBusquedaUbigeos(data) {
    this.ubigeos = data;
    this.cargando = false;
  }

  paginate(event) {
    this.ubigeos = this.ubigeosCopia.slice(event.first, event.first+event.rows);
  }
}
