import { Component, OnInit, Input } from '@angular/core';
import { LS } from 'src/app/contantes/app-constants';
import { MenuItem } from 'primeng/api';
import { UtilService } from 'src/app/servicios/util/util.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Servicios } from 'src/app/entidades/entidad.servicios';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit {

  @Input() isModal: boolean = false; // establecemos si este componente es modal o no
  @Input() in_listaServicios: Array<Servicios> = []
  public constantes: any = LS;
  public parametrosListado: any = null;
  public items: MenuItem[];
  
  constructor(
    private utilService: UtilService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    if (!this.isModal) {
      this.items = this.utilService.generarItemsMenuesPaActivos(this);
    }
    this.parametrosListado = {
      listar: true,
      in_listaServicios: this.in_listaServicios,
      activos: false,
      isModal: this.isModal
    };
  }

  // proviene del menu
  nuevo() {
    this.parametrosListado = {
      accion: LS.ACCION_NUEVO, // accion nuevo
      listar: true,
      in_listaServicios: this.in_listaServicios,
      isModal: this.isModal
    }
  }

  consultarGeneral(activos: boolean) {
    this.parametrosListado = {
      listar: true,
      in_listaServicios: this.in_listaServicios,
      activos: activos,
      isModal: this.isModal
    };
  }
}
