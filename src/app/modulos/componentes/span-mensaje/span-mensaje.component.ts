import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-span-mensaje',
  templateUrl: './span-mensaje.component.html',
  styleUrls: ['./span-mensaje.component.css']
})
export class SpanMensajeComponent implements OnInit, ICellRendererAngularComp {
  
  public clase: string = "";
  public numero: number = 0;
  constructor() { }

  ngOnInit() {
  }

  agInit(params: any): void {
    this.mostrarSpan(params.value);
  }

  mostrarSpan(data) {
    if (data > 0) {
      this.clase = "badge badge-pill badge-danger";
      this.numero = data;
    } else {
      this.clase = "badge badge-pill badge-primary";
      this.numero = data;
    }
  }

  refresh(): boolean {
    return false;
  }
}
