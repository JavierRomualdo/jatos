import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle( LS.PAGINA_JATOS );
  }

  verPropiedades(propiedad: string) {
    LS.KEY_PROPIEDAD_SELECT = propiedad;
    this.router.navigate(['/welcome/propiedades'])
  }
}
