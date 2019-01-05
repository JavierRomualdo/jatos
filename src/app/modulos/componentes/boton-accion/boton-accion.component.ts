import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { LS } from 'src/app/contantes/app-constants';

@Component({
  selector: 'app-boton-accion',
  templateUrl: './boton-accion.component.html',
  styleUrls: ['./boton-accion.component.css']
})
export class BotonAccionComponent implements OnInit, ICellRendererAngularComp  {

  public constantes: any;
  public params: any;
  public icono: string = "";
  public tooltip: string = "";
  public accion: string = "";
  public class: string = "";

  constructor() { }

  ngOnInit() {
    this.constantes = LS;
  }

  agInit(params: any): void {
    this.params = params;
    if (params.accion) {
      this.icono = params.icono ? params.icono : "";
      this.tooltip = params.tooltip ? params.tooltip : "";
      this.accion = params.accion ? params.accion : "";
      this.class = params.class ? params.class : "";
    }
  }

  refresh(): boolean {
    return false;
  }

  ejecutarAccion(event) {
    this.params.context.componentParent.ejecutarConsultar(this.params.data, this.accion);
  }

}
