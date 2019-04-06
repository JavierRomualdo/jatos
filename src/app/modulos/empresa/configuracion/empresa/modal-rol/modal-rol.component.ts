import { Component, OnInit } from '@angular/core';
import { Rol } from 'src/app/entidades/entidad.rol';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/servicios/auth.service';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { RolService } from './rol.service';

@Component({
  selector: 'app-modal-rol',
  templateUrl: './modal-rol.component.html',
  styleUrls: ['./modal-rol.component.css']
})
export class ModalRolComponent implements OnInit {

  public rol: Rol;
  public vistaFormulario = false;
  public cargando: boolean = false;
  public verNuevo: boolean = false;
  public confirmarcambioestado: boolean = false;
  public roles: any = [];
  public rolesCopia: any = [];
  public parametros: Rol;
  public listado: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private rolService: RolService,
    private toastr: ToastrService,
    private modal: NgbModal,
    private auth: AuthService
  ) {
    this.rol = new Rol();
    this.parametros = new Rol();
  }

  ngOnInit() {
    this.listarRoles();
  }

  busqueda(): void {
    let nohayvacios: Boolean = false;
    if (this.parametros.rol !== undefined && this.parametros.rol !== '') {
      nohayvacios = true;
    }
    if (this.parametros.permiso !== undefined && this.parametros.permiso !== '' &&
    this.parametros.permiso !== null ) {
      nohayvacios = true;
    }
    if (nohayvacios) {
      this.cargando = true;
      this.rolService.busquedaRoles(this.parametros, this);
    } else {
      this.toastr.warning('Verifique los datos ingresados.', 'Datos inválidos');
    }
  }

  despuesDeBusquedaRoles(data) {
    this.roles = data;
    this.cargando = false;
    this.vistaFormulario = false;
    this.verNuevo = false;
  }

  limpiar() {
    this.parametros = new Rol();
    this.roles = [];
    this.listarRoles();
  }

  nuevo() {
    this.vistaFormulario = true;
    this.verNuevo = true;
    this.rol = new Rol();
  }

  listarRoles() {
    this.cargando = true;
    this.rolService.listarRoles(this);
  }

  despuesDeListarRoles(data) {
    this.roles = data;
    this.rolesCopia = data;
    this.cargando = false;
  }

  traerParaEdicion(id) {
    this.vistaFormulario = true;
    this.verNuevo = false;
    this.cargando = true;
    this.rolService.mostrarRol(id, this);
  }

  despuesDeMostrarRol(data) {
    this.rol = data;
    this.cargando = false;
  }

  guardarRol() {
    this.cargando = true;
    if (!this.rol.id) { // guardar nuevo rol
      this.rolService.ingresarRol(this.rol, this);
    } else { // guardar el rol editado
      this.rolService.modificarRol(this.rol, this);
    }
  }

  despuesDeIngresarRol(data) {
    this.cargando = false;
    this.vistaFormulario = false;
    this.verNuevo = false;
    this.listarRoles();
  }

  despuesDeModificarRol(data) {
    this.cargando = false;
    this.vistaFormulario = false;
    this.verNuevo = false;
    this.listarRoles();
  }

  confirmarcambiodeestado(rol): void {
    const modalRef = this.modal.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadorol(rol);
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      rol.estado = !rol.estado;
      this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadorol(rol) {
    this.cargando = true;
    this.rolService.cambiarEstadoRol(rol.id, this);
  }

  despuesDeCambiarEstadoRol(data) {
    this.listarRoles();
    this.cargando = false;
  }

  enviarrol(rol: Rol) {
    this.activeModal.close(rol);
  }

  paginate(event) {
    this.roles = this.rolesCopia.slice(event.first, event.first+event.rows);
  }
}
