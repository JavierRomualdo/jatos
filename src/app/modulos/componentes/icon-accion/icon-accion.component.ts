import { Component, OnInit } from '@angular/core';
import { LS } from 'src/app/contantes/app-constants';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-icon-accion',
  templateUrl: './icon-accion.component.html',
  styleUrls: ['./icon-accion.component.css']
})
export class IconAccionComponent implements OnInit, ICellRendererAngularComp {

  public constantes: any;
  public icono: string = "";
  public tooltip: string = "";

  constructor() { }

  ngOnInit() {
    this.constantes = LS;
  }

  agInit(params: any): void {
    this.buscarIcono(params.value);
  }

  buscarIcono(data) {
    switch(data) {
      case 'L':
        this.icono = LS.ICON_LIBRE;
        this.tooltip = LS.TAG_LIBRE;
        break;
      case 'V':
        this.icono = LS.ICON_VENTA;
        this.tooltip = LS.TAG_VENTA;
        break;
      case 'A':
        this.icono = LS.ICON_ALQUILER;
        this.tooltip = LS.TAG_ALQUILER;
        break;
      case 'R':
        this.icono = LS.ICON_RESERVADO;
        this.tooltip = LS.TAG_RESERVADO;
        break;
    }
  }

  refresh(): boolean {
    return false;
  }
}
