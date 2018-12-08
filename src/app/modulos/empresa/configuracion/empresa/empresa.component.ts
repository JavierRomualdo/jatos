import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/entidades/entidad.users';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/servicios/auth.service';
import { ModalEmpresaComponent } from './modal-empresa/modal-empresa.component';
import { ModalPersonaComponent } from './modal-persona/modal-persona.component';
import { ModalRolComponent } from './modal-rol/modal-rol.component';
import { ModalServicioComponent } from './modal-servicio/modal-servicio.component';
import { ModalUsuarioComponent } from './modal-usuario/modal-usuario.component';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { UsuarioService } from './modal-usuario/usuario.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaConfiguracionComponent implements OnInit {

  public cargando: Boolean = false;
  public confirmarcambioestado: Boolean = false;
  public  usuarios: any = []; // lista proyecto
  public parametros: Users;
  
  constructor(
    private modalService: NgbModal,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private auth: AuthService,
  ) {
    this.parametros = new Users();
  }

  ngOnInit() {
    this.listarUsuarios();
  }
  // Metodos para abrir los modales
  abrirDatos(): void {
    const modalRef = this.modalService.open(ModalEmpresaComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  abrirPersonas(): void {
    const modalRef = this.modalService.open(ModalPersonaComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  abrirRoles() {
    const modalRef = this.modalService.open(ModalRolComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  abrirServicios() {
    const modalRef = this.modalService.open(ModalServicioComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  abrirUsuario() {
    const modalRef = this.modalService.open(ModalUsuarioComponent, {size: 'lg', keyboard: false});
    modalRef.result.then((result) => {
      this.listarUsuarios();
    }, (reason) => {
    });
  }

  editarUsuario(id) {
    const modalRef = this.modalService.open(ModalUsuarioComponent, {size: 'lg', keyboard: true});
    // asi... le pasamos el parametro id del usuario en el modal-usuario :p
    modalRef.componentInstance.edit = id;
    modalRef.result.then((result) => {
      this.listarUsuarios();
    }, (reason) => {
    });
  }

  listarUsuarios() {
    this.cargando = true;
    this.usuarioService.listarUsuarios(this);
  }

  despuesDeListarUsuarios(data) {
    this.usuarios = data;
    this.cargando = false;
    console.log('resultado: ');
    console.log(this.usuarios);
  }

  confirmarcambiodeestado(usuario): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoservicio(usuario);
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      usuario.estado = !usuario.estado;
      this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoservicio(usuario) {
    this.cargando = true;
    this.usuarioService.cambiarEstadoUsuario(usuario.id, this);
  }

  despuesDeCambiarEstadoUsuario(data) {
    console.log(data);
    this.listarUsuarios();
    this.cargando = false;
  }

  limpiar() {
    this.parametros = new Users();
    this.usuarios = [];
    this.listarUsuarios();
  }

  busqueda() {
    let nohayvacios: Boolean = false;
    if (this.parametros.name !== undefined && this.parametros.name !== '') {
      nohayvacios = true;
    }
    if (this.parametros.email !== undefined && this.parametros.email !== '') {
      nohayvacios = true;
    }
    if (nohayvacios) {
      console.log(this.parametros);
      this.usuarioService.busquedaUsuarios(this.parametros,  this);
    } else {
      this.toastr.warning('Verifique los datos ingresados.', 'Datos inválidos');
    }
  }

  despuesDeBusquedaUsuarios(data) {
    console.log(data);
    this.usuarios = data;
    this.cargando = false;
  }
}
