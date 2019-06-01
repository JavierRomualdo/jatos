import { Component, OnInit } from '@angular/core';
import { LS } from 'src/app/contantes/app-constants';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit {

  public servicio = LS.KEY_SERVICIO_DOCUMENT;
  constructor() { }

  ngOnInit() {
  }

}
