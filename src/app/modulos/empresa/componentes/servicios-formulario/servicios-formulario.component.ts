import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Servicios } from 'src/app/entidades/entidad.servicios';
import { LS } from 'src/app/contantes/app-constants';
import { ServicioService } from '../../configuracion/servicios/servicio.service';

@Component({
  selector: 'app-servicios-formulario',
  templateUrl: './servicios-formulario.component.html',
  styleUrls: ['./servicios-formulario.component.css']
})
export class ServiciosFormularioComponent implements OnInit {

  @Input() parametrosFormulario: any;
  @Output() enviarAccion = new EventEmitter();
  
  public servicio: Servicios;
  public cargando: Boolean = false;
  public accion: string = null;
  public tituloForm: string = null;
  public constantes: any = LS;

  constructor(
    private servicioService: ServicioService
  ) { }

  ngOnInit() {
    this.servicio = new Servicios();
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
        this.tituloForm = LS.TITULO_FORM_NUEVO_SERVICIO;
        break;
      case LS.ACCION_EDITAR:
        this.tituloForm = LS.TITULO_FORM_EDITAR_SERVICIO;
        this.traerParaEdicion(this.parametrosFormulario.servicio.id);
        break;
      case LS.ACCION_CONSULTAR:
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_SERVICIO;
        this.traerParaEdicion(this.parametrosFormulario.servicio.id);
        break;
      default:
        break;
    }
  }

  traerParaEdicion(id) {
    this.cargando = true;
    this.servicioService.mostrarServicio(id, this);
  }

  despuesDeMostrarServicio(data) {
    console.log('esto trajo para editar');
    console.log(data);
    this.servicio = data;
    this.cargando = false;
  }

  guardarServicio() {
    this.cargando = true;
    if (this.accion === LS.ACCION_NUEVO) { // guardar nuevo rol
      console.log('antes de guardar servicio: ');
      console.log(this.servicio);
      this.servicioService.ingresarServicio(this.servicio, this);
    } else if (this.accion === LS.ACCION_EDITAR) { // guardar el rol editado
      this.servicioService.modificarServicio(this.servicio, this);
    }
  }

  despuesDeIngresarServicio(data) {
    console.log('se guardo estos datos: ');
    console.log(data);
    this.cargando = false;
    let parametros = { accion: this.accion, servicio: new Servicios(data) }
    this.enviarAccion.emit(parametros);
  }

  despuesDeModificarServicio(data) {
    console.log(data);
    this.cargando = false;
    let parametros = { accion: this.accion, servicio: new Servicios(data) }
    this.enviarAccion.emit(parametros);
  }
  
  cancelar() {
    let parametros = {
      accion : LS.ACCION_CANCELAR,
      servicio: this.servicio
    }
    this.enviarAccion.emit(parametros);
  }
}
