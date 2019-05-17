import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Persona } from 'src/app/entidades/entidad.persona';
import { UbigeoGuardar } from 'src/app/entidades/entidad.ubigeoguardar';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { PersonaService } from '../../configuracion/personas/persona.service';
import { LS } from 'src/app/contantes/app-constants';
import { ModalRolComponent } from '../../configuracion/empresa/modal-rol/modal-rol.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ModalUbigeoComponent } from '../../configuracion/ubigeo/modal-ubigeo/modal-ubigeo.component';

@Component({
  selector: 'app-personas-formulario',
  templateUrl: './personas-formulario.component.html',
  styleUrls: ['./personas-formulario.component.css']
})
export class PersonasFormularioComponent implements OnInit {

  @Input() parametrosFormulario: any;
  @Output() enviarAccion = new EventEmitter();
  
  public persona: Persona;
  public cargando: boolean = false;
  public personas: any = [];
  public ubigeo: UbigeoGuardar;
  public listaPR: any = []; // lista de persona-roles
  public accion: string = null;
  public tituloForm: string = null;
  public constantes: any = LS;

  constructor(
    private personaService: PersonaService,
    private modal: NgbModal,
    private toastr: ToastrService, // para mensajes de exito o error
  ) { }

  ngOnInit() {
    this.persona = new Persona();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.listaPR = [];
  }

  ngOnChanges(changes) {
    if (changes.parametrosFormulario) {
      if (changes.parametrosFormulario.currentValue) {
        this.accion = this.parametrosFormulario.accion;
        this.postIniciarVistaFormulario(this.accion);
      }
    }
  }

  postIniciarVistaFormulario(accion: string) {
    // titulo del formulario
    switch (accion) {
      case LS.ACCION_NUEVO:
        this.tituloForm = LS.TITULO_FORM_NUEVA_PERSONA;
        break;
      case LS.ACCION_EDITAR:
        this.tituloForm = LS.TITULO_FORM_EDITAR_PERSONA;
        this.traerParaEdicion(this.parametrosFormulario.persona.id);
        break;
      case LS.ACCION_CONSULTAR:
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_PERSONA;
        this.traerParaEdicion(this.parametrosFormulario.persona.id);
        break;
      default:
        break;
    }
  }

  limpiar() {
    this.personas = [];
    this.persona.ubigeo_id = new Ubigeo();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
  }

  traerParaEdicion(id) {
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
    if (this.accion === LS.ACCION_NUEVO) { // guardar nuevo rol
      console.log('antes de guardar persona: ');
      console.log(this.persona);
      this.personaService.ingresarPersona(this.persona, this);
    } else if (this.accion === LS.ACCION_EDITAR) { // guardar el rol editado
      this.personaService.modificarPersona(this.persona, this);
    }
  }

  despuesDeIngresarPersona(data) {
    console.log('se guardo estos datos: ');
    console.log(data);
    this.cargando = false;
    this.persona.id = data.id;
    let parametros = { accion: this.accion, persona: this.persona }
    this.enviarAccion.emit(parametros);
  }

  despuesDeModificarPersona(data) {
    console.log(data);
    this.cargando = false;
    this.persona.id = data.id;
    let parametros = { accion: this.accion, persona: this.persona }
    this.enviarAccion.emit(parametros);
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
        // this.auth.agregarmodalopenclass();
      }, (reason) => {
          // this.auth.agregarmodalopenclass();
        }
    );
  }

  buscarubigeo() {
    const modalRef = this.modal.open(ModalUbigeoComponent, {size: 'lg', keyboard: true});
    modalRef.componentInstance.nivelTipoUbigeo = 3;
    // 3 es distrito (que me retorne un distrito)
    modalRef.result.then((result) => {
      console.log('ubigeoguardar:');
      console.log(result);
      this.ubigeo = result;
      this.persona.ubigeo_id = result.ubigeo;
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      // this.auth.agregarmodalopenclass();
    });
  }

  quitardelista(pr) {
    this.listaPR.pop(pr);
  }

  cancelar() {
    let parametros = {
      accion : LS.ACCION_CANCELAR,
      persona: this.persona
    }
    this.enviarAccion.emit(parametros);
  }
}
