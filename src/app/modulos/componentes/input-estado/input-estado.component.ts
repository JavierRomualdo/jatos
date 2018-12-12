import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { LS } from 'src/app/contantes/app-constants';

@Component({
  selector: 'app-input-estado',
  templateUrl: './input-estado.component.html',
  styleUrls: ['./input-estado.component.css']
})
export class InputEstadoComponent implements OnInit, ICellRendererAngularComp {

  constantes: any;
  public params: any;
  public valorActual: boolean = false;

  constructor() { }

  ngOnInit() {
    this.constantes = LS;
  }

  agInit(params: any): void {
    this.params = params;
    this.valorActual = this.params.value ? true : false;
  }

  refresh(): boolean {
    return false;
  }
}
