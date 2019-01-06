import { Component, OnInit } from '@angular/core';
import { LS } from 'src/app/contantes/app-constants';
import {Router} from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  public constantes: any = LS;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  verPropiedades(propiedad: string) {
    LS.KEY_PROPIEDAD_SELECT = propiedad;
    this.router.navigate(['/welcome/propiedades'])
  }
}
