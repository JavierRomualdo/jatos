import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { LS } from 'src/app/contantes/app-constants';

@Component({
  selector: 'app-imagen-accion',
  templateUrl: './imagen-accion.component.html',
  styleUrls: ['./imagen-accion.component.css']
})
export class ImagenAccionComponent implements OnInit, ICellRendererAngularComp {

  constantes: any;
  public params: any;
  public foto: string;
  public display: boolean = false;

  constructor() { }

  ngOnInit() {
    this.constantes = LS;
  }

  agInit(params: any): void {
    this.params = params;
    this.foto = this.params.value;
  }

  refresh(): boolean {
    return false;
  }

  mostrarModalImagen() {
    this.params.context.componentParent.mostrarModalImagen(this.params.data)
  }

  showDialog() {
    this.display = true;
  }

  onDialogClose(event) {
    this.display = event;
 }
}
