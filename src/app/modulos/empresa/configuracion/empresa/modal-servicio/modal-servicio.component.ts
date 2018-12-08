import { Component, OnInit } from '@angular/core';
import { Servicios } from 'src/app/entidades/entidad.servicios';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/servicios/auth.service';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { ServicioService } from './servicio.service';

@Component({
  selector: 'app-modal-servicio',
  templateUrl: './modal-servicio.component.html',
  styleUrls: ['./modal-servicio.component.css']
})
export class ModalServicioComponent implements OnInit {

  public servicio: Servicios;
  public vistaFormulario = false;
  public cargando: Boolean = false;
  public verNuevo: Boolean = false;
  public confirmarcambioestado: Boolean = false;
  public servicios: any = [];
  public parametros: Servicios;

  public listado: Boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private servicioService: ServicioService,
    private toastr: ToastrService,
    private modal: NgbModal,
    private auth: AuthService
  ) {
    this.servicio = new Servicios();
    this.parametros = new Servicios();
  }

  ngOnInit() {
    this.listarServicios();
  }

  busqueda(): void {
    let nohayvacios: Boolean = false;
    if (this.parametros.servicio !== undefined && this.parametros.servicio !== '') {
      nohayvacios = true;
    }
    if (this.parametros.detalle !== undefined && this.parametros.detalle !== '') {
      nohayvacios = true;
    }
    if (nohayvacios) {
      this.cargando = true;
      this.servicioService.busquedaServicios(this.parametros, this);
    } else {
      this.toastr.warning('Verifique los datos ingresados.', 'Datos inválidos');
    }
  }

  despuesDeBusquedaServicios(data) {
    this.servicios = data;
    this.cargando = false;
    this.vistaFormulario = false;
    this.verNuevo = false;
  }

  limpiar() {
    this.parametros = new Servicios();
    this.servicios = [];
    this.listarServicios();
  }

  nuevo(): void {
    this.vistaFormulario = true;
    this.verNuevo = true;
    this.servicio = new Servicios();
  }

  listarServicios() {
    this.cargando = true;
    this.servicioService.listarServicios(this);
  }

  despuesDeListarServicios(data) {
    this.servicios = data;
    this.cargando = false;
  }

  traerParaEdicion(id) {
    this.vistaFormulario = true;
    this.verNuevo = false;
    this.cargando = true;
    this.servicioService.mostrarServicio(id, this);
  }

  despuesDeMostrarServicio(data) {
    this.servicio = data;
    this.cargando = false;
  }

  guardarServicio() {
    this.cargando = true;
    if (!this.servicio.id) { // guardar nuevo servicio
      this.servicioService.ingresarServicio(this.servicio, this);
    } else { // guardar el servicio editado
      this.servicioService.modificarServicio(this.servicio, this);
    }
  }

  despuesDeIngresarServicio(data) {
    this.cargando = false;
    this.vistaFormulario = false;
    this.verNuevo = false;
    this.listarServicios();
  }

  despuesDeModificarServicio(data) {
    this.cargando = false;
    this.vistaFormulario = false;
    this.verNuevo = false;
    this.listarServicios();
  }

  confirmarcambiodeestado(servicio): void {
    const modalRef = this.modal.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoservicio(servicio);
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      servicio.estado = !servicio.estado;
      this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoservicio(servicio) {
    this.cargando = true;
    this.servicioService.cambiarEstadoServicio(servicio.id, this);
  }

  despuesDeCambiarEstadoServicio(data) {
    this.listarServicios();
    this.cargando = false;
  }

  enviarservicio(servicio: Servicios) {
    this.activeModal.close(servicio);
  }
}
