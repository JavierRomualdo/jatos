import { Component, OnInit } from '@angular/core';
import { LS } from 'src/app/contantes/app-constants';

@Component({
  selector: 'app-boton-opciones',
  templateUrl: './boton-opciones.component.html',
  styleUrls: ['./boton-opciones.component.css']
})
export class BotonOpcionesComponent implements OnInit {

  constantes: any;
  public params: any;
  public titulo: string;
  public clase: string;
  public condicion: boolean;//requerido para mostrar boton extra

  constructor() { }

  ngOnInit() {
    this.constantes = LS;
  }

  agInit(params: any): void {
    this.params = params;
    this.titulo = params.titulo;
    this.clase = params.clase;
    this.condicion = params.condicion;
  }

  refresh(): boolean {
    return false;
  }

  mostrarOpciones(event) {
    this.params.context.componentParent.mostrarOpciones(event, this.params.data)
  }

  //ejecutar acciones adicionales con boton extra, visible solo con parametro opciones
  accionAdicional(){
    this.params.context.componentParent.accionAdicional(this.params.data);
  }
}
