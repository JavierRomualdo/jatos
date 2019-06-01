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
    this.router.navigate(['/welcome/propiedades']);
  }

  verServicio(servicio: string) {
    switch (servicio) {
      case LS.TAG_JARDINERIA:
        LS.KEY_SERVICIO_DOCUMENT = {
          titulo: servicio,
          documento: "assets/documentos/estados-de-las-promesas.pdf"
        };
        break;
      case LS.TAG_DISENIO_INTERIORES:
        LS.KEY_SERVICIO_DOCUMENT = {
          titulo: servicio,
          documento: "assets/documentos/INDUSTRIAS ALIMENTARIAS_2.pdf"
        };
        break;
      case LS.TAG_DISENIO_EXTERIORES:
        LS.KEY_SERVICIO_DOCUMENT = {
          titulo: servicio,
          documento: "assets/documentos/LIBRO 100 Experimentos sencillos Fisica y Quimica.pdf"
        };     
        break;
      case LS.TAG_CAMARA_VIGILANCIA:
        LS.KEY_SERVICIO_DOCUMENT = {
          titulo: servicio,
          documento: "assets/documentos/NIIF.pdf"
        };        
        break;
      default:
        break;
    }
    this.router.navigate(['/welcome/servicios']); 
  }
}
