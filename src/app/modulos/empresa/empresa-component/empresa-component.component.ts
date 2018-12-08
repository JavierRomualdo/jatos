import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-empresa-component',
  templateUrl: './empresa-component.component.html',
  styleUrls: ['./empresa-component.component.css']
})
export class EmpresaComponentComponent implements OnInit {

  public fechaActual: Date;
  constructor() { }

  ngOnInit() {
    this.fechaActual = new Date();
  }

}
