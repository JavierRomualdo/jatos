import { Component, OnInit } from '@angular/core';
import { Persona } from 'src/app/entidades/entidad.persona';
import { Rol } from 'src/app/entidades/entidad.rol';
import { UbigeoGuardar } from 'src/app/entidades/entidad.ubigeoguardar';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/servicios/auth.service';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { ModalRolComponent } from '../modal-rol/modal-rol.component';
import { ModalUbigeoComponent } from '../../ubigeo/modal-ubigeo/modal-ubigeo.component';
import { PersonaService } from './persona.service';
import { RolService } from '../modal-rol/rol.service';

@Component({
  selector: 'app-modal-persona',
  templateUrl: './modal-persona.component.html',
  styleUrls: ['./modal-persona.component.css']
})
export class ModalPersonaComponent implements OnInit {

  public persona: Persona;
  public vistaFormulario = false;
  public cargando: Boolean = false;
  public verNuevo: Boolean = false;
  public confirmarcambioestado: Boolean = false;
  public personas: any = [];
  public roles: Rol[];
  public rolSeleccionado: Rol;
  public ubigeo: UbigeoGuardar;
  public parametros: Persona;
  public idServicio: Number = 0; // sirve para el combo roles en la busqueda

  public listado: Boolean = false;
  public listaPR: any = []; // lista de persona-roles

  constructor(
    private activeModal: NgbActiveModal,
    private personaService: PersonaService,
    private rolService: RolService,
    private toastr: ToastrService, // para mensajes de exito o error
    private modal: NgbModal,
    private auth: AuthService
  ) {
    this.persona = new Persona();
    this.parametros = new Persona();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.roles = [];
    this.rolSeleccionado = null;
    this.listaPR = [];
  }

  ngOnInit() {
    this.listarPersonas();
    this.listarRoles();
  }

  busqueda() {
    let nohayvacios: Boolean = false;
    if (this.parametros.nombres !== undefined && this.parametros.nombres !== '') {
      nohayvacios = true;
    }
    if (this.parametros.dni !== undefined && this.parametros.dni !== '') {
      nohayvacios = true;
    }
    if (this.rolSeleccionado) {
      nohayvacios = true;
      this.parametros.rol_id = this.rolSeleccionado;
    }
    
    if (nohayvacios) {
      console.log(this.parametros);
      this.personaService.busquedaPersonas(this.parametros, this);
    } else {
      this.toastr.warning('Verifique los datos ingresados.', 'Datos inválidos');
    }
  }

  despuesDeBusquedaPersonas(data) {
    console.log(data);
    this.personas = data;
    this.cargando = false;
    this.vistaFormulario = false;
    this.verNuevo = false;
  }

  limpiar() {
    this.parametros = new Persona();
    this.personas = [];

    this.persona.ubigeo_id = new Ubigeo();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();

    this.listarPersonas();
  }

  nuevo() {
    this.vistaFormulario = true;
    this.verNuevo = true;
    this.persona = new Persona();
    this.listaPR = [];
    this.listaPR = this.listaPR && this.listaPR.length > 0 ? this.listaPR : [];
  }

  listarPersonas() {
    this.cargando = true;
    this.personaService.listarPersonas(this);
  }

  despuesDeListarPersonas(data) {
    this.personas = data;
    this.cargando = false;
    console.log(data);
  }

  listarRoles() {
    this.cargando = true;
    this.rolService.listarRoles(this);
  }

  despuesDeListarRoles(data) {
    this.roles = data;
    this.cargando = false;
    console.log(data);
  }

  traerParaEdicion(id) {
    this.vistaFormulario = true;
    this.verNuevo = false;
    this.cargando = true;
    this.personaService.mostrarPersona(id, this);
  }

  despuesDeMostrarPersona(data) {
    console.log('esto trajo para editar');
    console.log(data);
    this.persona = data;
    this.ubigeo = data.ubigeo;
    this.cargando = false;
    this.listaPR = this.persona.personarolList && this.persona.personarolList.length > 0 ? this.persona.personarolList : [];
  }

  guardarPersona() {
    this.cargando = true;
    this.persona.personarolList = this.listaPR;
    this.persona.rol_id = this.listaPR[0]; // this.listaPR[0].idrol
    this.persona.ubigeo_id = this.ubigeo.ubigeo;
    if (!this.persona.id) { // guardar nuevo rol
      console.log('antes de guardar persona: ');
      console.log(this.persona);
      this.personaService.ingresarPersona(this.persona, this);
    } else { // guardar el rol editado
      this.personaService.modificarPersona(this.persona, this);
    }
  }

  despuesDeIngresarPersona(data) {
    console.log('se guardo estos datos: ');
    console.log(data);
    this.cargando = false;
    this.vistaFormulario = false;
    this.verNuevo = false;
    this.listarPersonas();
  }

  despuesDeModificarPersona(data) {
    console.log(data);
    this.cargando = false;
    this.vistaFormulario = false;
    this.verNuevo = false;
    this.listarPersonas();
  }

  confirmarcambiodeestado(persona) {
    const modalRef = this.modal.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: true});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadopersona(persona);
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      persona.estado = !persona.estado;
      this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadopersona(persona) {
    this.cargando = true;
    this.personaService.cambiarEstadoPersona(persona, this);
  }

  despuesDeCambiarEstadoPersona(data) {
    console.log(data);
    this.listarPersonas();
    this.cargando = false;
  }

  abrirrol() {
    const modalRef = this.modal.open(ModalRolComponent, {windowClass: 'nuevo-modal', size: 'lg', keyboard: true});
      modalRef.result.then((result) => {
        const rol = result;
        console.log('se selecciono el rol: ');
        console.log(result);
        const rSelect = this.listaPR.find(item => item.idrol.id === rol.id);
        if (rSelect && rSelect.idrol && rSelect.idrol.id) {
          this.toastr.warning('Rol ya existe', 'Aviso');
        } else {
          this.listaPR.push(rol);
        }
        this.auth.agregarmodalopenclass();
      }, (reason) => {
          this.auth.agregarmodalopenclass();
        }
    );
  }

  buscarubigeo() {
    const modalRef = this.modal.open(ModalUbigeoComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
      console.log('ubigeoguardar:');
      console.log(result);
      this.ubigeo = result;
      this.persona.ubigeo_id = result.ubigeo;
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  quitardelista(pr) {
    this.listaPR.pop(pr);
  }

  enviarpersona(persona: Persona) {
    this.activeModal.close(persona);
  }

}
