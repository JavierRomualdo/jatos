import { Component, OnInit, Input } from '@angular/core';
import { Persona } from 'src/app/entidades/entidad.persona';
import { MenuItem } from 'primeng/api';
import { LS } from 'src/app/contantes/app-constants';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from 'src/app/servicios/util/util.service';
import { PersonaTO } from 'src/app/entidadesTO/empresa/PersonaTO';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.css']
})
export class PersonasComponent implements OnInit {

  @Input() isModal: boolean = false; // establecemos si este componente es modal o no 
  public cargando: boolean = false;
  public parametros: Persona;
  public parametrosListado: any = null;
  public parametrosFormulario: any = null;
  public vistaFormulario: boolean = false;
  public constantes: any = LS;
  public items: MenuItem[];

  constructor(
    private utilService: UtilService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.parametros = new Persona();
    this.listarPersonas(false);
    if (!this.isModal) {
      this.items = this.utilService.generarItemsMenuesPaActivos(this);
    }
  }

  // proviene del menu
  nuevo() {
    let parametros = {
      accion: LS.ACCION_NUEVO, // accion nuevo
      casa: null
    }
    this.ejecutarAccion(parametros);
  }

  consultarGeneral(activos: boolean) {
    this.listarPersonas(activos);
  }
  
  listarPersonas(activos: boolean) {
    this.vistaFormulario = false;
    this.parametrosListado = {
      listar: true,
      activos: activos,
      isModal: this.isModal
    };
  }

  ejecutarAccion(parametros) { // origen del listado de personas
    // parametros {accion: string . persona: PersonaTO}
    this.parametrosFormulario = parametros;
    this.vistaFormulario = true;
    // this.abrirPropiedades(parametros);
  }

  ejecutarAccionPaFormulario(data) { // oriden del formulario de personas
    // data {accion: string . persona: Persona}
    switch (data.accion) {
      case LS.ACCION_NUEVO:
      case LS.ACCION_EDITAR:
      case LS.ACCION_CONSULTAR:
        let personaTO: PersonaTO = this.convertirPersonaAPersonaTO(data.persona);
        this.parametrosListado = {
          listar: true,
          accion: data.accion,
          persona: personaTO,
          isModal: this.isModal
        };
        this.vistaFormulario = false;
        break;
      case LS.ACCION_CANCELAR:
        this.vistaFormulario = false;
        break;
      default:
        break;
    }
  }

  convertirPersonaAPersonaTO(persona: Persona): PersonaTO {
    let personaTO = new PersonaTO(persona);
    personaTO.ubicacion = persona.ubigeo_id.ubigeo;
    personaTO.rol = persona.rol_id.rol;
    return personaTO;
  }
}
