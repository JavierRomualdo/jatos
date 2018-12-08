import { Component, OnInit } from '@angular/core';
import { Habitacion } from 'src/app/entidades/entidad.habitacion';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { Persona } from 'src/app/entidades/entidad.persona';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { ModalHabitacionComponent } from './modal-habitacion/modal-habitacion.component';
import { HabitacionService } from './habitacion.service';

@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css']
})
export class HabitacionesComponent implements OnInit {

  public cargando: Boolean = false;
  public confirmarcambioestado: Boolean = false;
  public  habitaciones: any = []; // lista proyecto
  public parametros: Habitacion;

  constructor(
    private modalService: NgbModal,
    private habitacionService: HabitacionService,
    private toastr: ToastrService,
  ) {
    this.parametros = new Habitacion();
    this.parametros.ubigeo_id = new Ubigeo();
    this.parametros.persona_id = new Persona();
  }

  ngOnInit() {
    this.listarHabitaciones();
  }

  limpiar() {
    this.parametros = new Habitacion();
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
    this.habitaciones = [];
    this.listarHabitaciones();
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
      this.habitacionService.busquedaHabitaciones(this.parametros, this);
    } else {
      this.toastr.warning('Verifique los datos ingresados.', 'Datos inválidos');
    }
  }

  despuesDeBusquedaHabitaciones(data) {
    this.habitaciones = data;
    this.cargando = false;
  }

  abrirHabitaciones(): void {
    const modalRef = this.modalService.open(ModalHabitacionComponent, {size: 'lg', keyboard: false});
    modalRef.result.then((result) => {
      this.listarHabitaciones();
    }, (reason) => {
    });
  }

  editarHabitacion(id) {
    const modalRef = this.modalService.open(ModalHabitacionComponent, {size: 'lg', keyboard: false});
    modalRef.componentInstance.edit = id;
    modalRef.result.then((result) => {
      this.listarHabitaciones();
    }, (reason) => {
    });
  }

  confirmarcambiodeestado(habitacion): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoservicio(habitacion);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      habitacion.estado = !habitacion.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoservicio(habitacion) {
    this.cargando = true;
    this.habitacionService.cambiarEstadoHabitacion(habitacion.id, this);
  }

  despuesDeCambiarEstadoHabitacion(data) {
    console.log(data);
    this.listarHabitaciones();
    this.cargando = false;
  }

  listarHabitaciones() {
    this.cargando = true;
    this.habitacionService.listarHabitaciones(this);
  }

  despuesDeListarHabitaciones(data) {
    this.habitaciones = data;
    this.cargando = false;
    console.log('resultado: ');
    console.log(this.habitaciones);
  }
}
