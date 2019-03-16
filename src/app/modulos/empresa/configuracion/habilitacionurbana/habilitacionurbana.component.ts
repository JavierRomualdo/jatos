import { Component, OnInit, Input } from '@angular/core';
import { LS } from 'src/app/contantes/app-constants';
import { MenuItem } from 'primeng/api';
import { UtilService } from 'src/app/servicios/util/util.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-habilitacionurbana',
  templateUrl: './habilitacionurbana.component.html',
  styleUrls: ['./habilitacionurbana.component.css']
})
export class HabilitacionurbanaComponent implements OnInit {

  @Input() isModal: boolean = false; // establecemos si este componente es modal o no
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
      activos: false,
      isModal: this.isModal
    };
  }

  // proviene del menu
  nuevo() {
    this.parametrosListado = {
      accion: LS.ACCION_NUEVO, // accion nuevo
      listar: true,
      isModal: this.isModal
    }
  }

  consultarGeneral(activos: boolean) {
    this.parametrosListado = {
      listar: true,
      activos: activos,
      isModal: this.isModal
    };
  }
}
