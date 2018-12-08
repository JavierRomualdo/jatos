import { Component, OnInit } from '@angular/core';
import { Local } from 'src/app/entidades/entidad.local';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { Persona } from 'src/app/entidades/entidad.persona';
import { ModalLocalComponent } from './modal-local/modal-local.component';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { LocalService } from './local.service';

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

  constructor(
    private modalService: NgbModal,
    private localService: LocalService,
    private toastr: ToastrService,
  ) {
    this.parametros = new Local();
    this.parametros.ubigeo_id = new Ubigeo();
    this.parametros.persona_id = new Persona();
  }

  ngOnInit() {
    this.listarLocales();
  }

  limpiar() {
    this.parametros = new Local();
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
    this.locales = [];
    this.listarLocales();
  }

  busqueda() {
    let nohayvacios: Boolean = false;
    if (this.parametros.persona_id.nombres !== undefined &&
      this.parametros.persona_id.nombres !== '') {
        nohayvacios = true;
      }
    if (this.parametros.ubigeo_id.ubigeo !== undefined && this.parametros.ubigeo_id.ubigeo !== '') {
      nohayvacios = true;
    }
    if (this.parametros.direccion !== undefined && this.parametros.direccion !== '') {
      nohayvacios = true;
    }
    if (nohayvacios) {
      this.cargando = true;
      console.log(this.parametros);
      this.localService.busquedaLocales(this.parametros, this);
    } else {
      this.toastr.warning('Verifique los datos ingresados.', 'Datos inválidos');
    }
  }

  despuesDeBusquedaLocales(data) {
    console.log(data);
    this.locales = data;
    this.cargando = false;
  }

  abrirLocales(): void {
    const modalRef = this.modalService.open(ModalLocalComponent, {size: 'lg', keyboard: false});
    modalRef.result.then((result) => {
      this.listarLocales();
    }, (reason) => {
    });
  }

  editarLocal(id) {
    const modalRef = this.modalService.open(ModalLocalComponent, {size: 'lg', keyboard: false});
    modalRef.componentInstance.edit = id;
    modalRef.result.then((result) => {
      this.listarLocales();
    }, (reason) => {
    });
  }

  confirmarcambiodeestado(local): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoservicio(local);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      local.estado = !local.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoservicio(local) {
    this.cargando = true;
    this.localService.cambiarEstadoLocal(local.id, this);
  }

  despuesDeCambiarEstadoLocal(data) {
    console.log(data);
    this.listarLocales();
    this.cargando = false;
  }

  listarLocales() {
    this.cargando = true;
    this.localService.listarLocales(this);
  }

  despuesDeListarLocales(data) {
    this.locales = data;
    this.cargando = false;
    console.log('resultado: ');
    console.log(this.locales);
  }
}
