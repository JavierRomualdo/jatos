import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HabilitacionurbanaService } from '../../configuracion/habilitacionurbana/habilitacionurbana.service';
import { HabilitacionUrbana } from 'src/app/entidades/entidad.habilitacionurbana';
import { LS } from 'src/app/contantes/app-constants';

@Component({
  selector: 'app-habilitacionurbana-formulario',
  templateUrl: './habilitacionurbana-formulario.component.html',
  styleUrls: ['./habilitacionurbana-formulario.component.css']
})
export class HabilitacionurbanaFormularioComponent implements OnInit {

  @Input() parametrosFormulario: any;
  @Output() enviarAccion = new EventEmitter();
  
  public habilitacionurbana: HabilitacionUrbana;
  public cargando: Boolean = false;
  public accion: string = null;
  public tituloForm: string = null;
  public constantes: any = LS;

  constructor(
    private habilitacionurbanaService: HabilitacionurbanaService
  ) { }

  ngOnInit() {
    this.habilitacionurbana = new HabilitacionUrbana();
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
        this.tituloForm = LS.TITULO_FORM_NUEVA_HABILITACION_URBANA;
        break;
      case LS.ACCION_EDITAR:
        this.tituloForm = LS.TITULO_FORM_EDITAR_HABILITACION_URBANA;
        this.traerParaEdicion(this.parametrosFormulario.habilitacionurbana.id);
        break;
      case LS.ACCION_CONSULTAR:
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_HABILITACION_URBANA;
        this.traerParaEdicion(this.parametrosFormulario.habilitacionurbana.id);
        break;
      default:
        break;
    }
  }

  traerParaEdicion(id) {
    this.cargando = true;
    this.habilitacionurbanaService.mostrarHabilitacionUrbana(id, this);
  }

  despuesDeMostrarHabilitacionUrbana(data) {
    console.log('esto trajo para editar');
    console.log(data);
    this.habilitacionurbana = data;
    this.cargando = false;
  }

  guardarHabitacionUrbana() {
    this.cargando = true;
    if (this.accion === LS.ACCION_NUEVO) { // guardar nuevo rol
      console.log('antes de guardar habilitacionurbana: ');
      console.log(this.habilitacionurbana);
      this.habilitacionurbanaService.ingresarHabilitacionUrbana(this.habilitacionurbana, this);
    } else if (this.accion === LS.ACCION_EDITAR) { // guardar el rol editado
      this.habilitacionurbanaService.modificarHabilitacionUrbana(this.habilitacionurbana, this);
    }
  }

  despuesDeIngresarHabilitacionUrbana(data) {
    console.log('se guardo estos datos: ');
    console.log(data);
    this.cargando = false;
    let parametros = { accion: this.accion, habilitacionurbana: new HabilitacionUrbana(data) }
    this.enviarAccion.emit(parametros);
  }

  despuesDeModificarHabilitacionUrbana(data) {
    console.log(data);
    this.cargando = false;
    let parametros = { accion: this.accion, habilitacionurbana: new HabilitacionUrbana(data) }
    this.enviarAccion.emit(parametros);
  }
  
  cancelar() {
    let parametros = {
      accion : LS.ACCION_CANCELAR,
      habilitacionurbana: this.habilitacionurbana
    }
    this.enviarAccion.emit(parametros);
  }
}
