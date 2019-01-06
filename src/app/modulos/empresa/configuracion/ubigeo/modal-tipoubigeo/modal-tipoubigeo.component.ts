import { Component, OnInit } from '@angular/core';
import { UbigeoTipo } from 'src/app/entidades/entidad.tipoubigeo';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/servicios/auth.service';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { TipoubigeoService } from './tipoubigeo.service';
import { NgForm } from '@angular/forms';
import { UtilService } from 'src/app/servicios/util/util.service';

@Component({
  selector: 'app-modal-tipoubigeo',
  templateUrl: './modal-tipoubigeo.component.html',
  styleUrls: ['./modal-tipoubigeo.component.css']
})
export class ModalTipoubigeoComponent implements OnInit {

  public tipoubigeo: UbigeoTipo;
  public vistaFormulario = false;
  public cargando: Boolean = false;
  public verNuevo: Boolean = false;
  public confirmarcambioestado: Boolean = false;
  public tipoubigeos: any = [];
  public parametros: UbigeoTipo;
  public listado: Boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private tipoUbigeoService: TipoubigeoService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private modal: NgbModal,
    private auth: AuthService
  ) {
    this.tipoubigeo = new UbigeoTipo();
    this.parametros = new UbigeoTipo();
  }

  ngOnInit() {
    this.listarTipoubigeos();
  }

  busqueda(form: NgForm): void {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      this.cargando = true;
      this.tipoUbigeoService.busquedaTipoUbigeos(this.parametros, this);
    } else {
      this.toastr.warning('Verifique los datos ingresados.', 'Datos inválidos');
    }
  }

  despuesDeBusquedaTipoUbigeos(data) {
    this.tipoubigeos = data;
    this.cargando = false;
    this.vistaFormulario = false;
    this.verNuevo = false;
  }

  limpiar() {
    this.parametros = new UbigeoTipo();
    this.tipoubigeos = [];
    this.listarTipoubigeos();
  }

  nuevo() {
    this.vistaFormulario = true;
    this.verNuevo = true;
    this.tipoubigeo = new UbigeoTipo();
  }

  listarTipoubigeos() {
    this.cargando = true;
    this.tipoUbigeoService.listarTipoUbigeos(this);
  }

  despuesDeListarTipoUbigeos(data) {
    this.tipoubigeos = data;
    this.cargando = false;
  }

  traerParaEdicion(id) {
    this.vistaFormulario = true;
    this.verNuevo = false;
    this.cargando = true;
    this.tipoUbigeoService.mostrarTipoUbigeo(id, this);
  }

  despuesDeMostrarTipoUbigeo(data) {
    this.tipoubigeo = data;
    this.cargando = false;
  }

  guardarTipoUbigeo(form: NgForm) {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      this.cargando = true;
      if (!this.tipoubigeo.id) { // guardar nuevo tipo ubigeo
        this.tipoUbigeoService.ingresarTipoUbigeo(this.tipoubigeo, this);
      } else { // guardar el tipo ubigeo editado
        this.tipoUbigeoService.modificarTipoUbigeo(this.tipoubigeo, this);
      }
    } else {
      this.toastr.warning('Verifique los datos ingresados.', 'Datos inválidos');
    }
  }

  despuesDeIngresarTipoUbigeo(data) {
    this.cargando = false;
    this.vistaFormulario = false;
    this.verNuevo = false;
    this.listarTipoubigeos();
  }

  despuesDeModificarTipoUbigeo(data) {
    this.cargando = false;
    this.vistaFormulario = false;
    this.verNuevo = false;
    this.listarTipoubigeos();
  }

  confirmarcambiodeestado(tipoubigeo): void {
    const modalRef = this.modal.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadotipoubigeo(tipoubigeo);
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      tipoubigeo.estado = !tipoubigeo.estado;
      this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadotipoubigeo(tipoubigeo) {
    this.cargando = true;
    this.tipoUbigeoService.cambiarEstadoTipoUbigeo(tipoubigeo.id, this);
  }

  despuesDeCambiarEstadoTipoUbigeo(data) {
    this.listarTipoubigeos();
    this.cargando = false;
  }

  enviartipoubigeo(tipoubigeo: UbigeoTipo) {
    this.activeModal.close(tipoubigeo);
  }
}
