import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from 'src/app/servicios/util/util.service';
import { LS } from 'src/app/contantes/app-constants';
import { MenuItem } from 'primeng/api';
import { ModalTipoubigeoComponent } from './modal-tipoubigeo/modal-tipoubigeo.component';

@Component({
  selector: 'app-ubigeo',
  templateUrl: './ubigeo.component.html',
  styleUrls: ['./ubigeo.component.css']
})
export class UbigeoComponent implements OnInit {

  @Input() isModal: boolean = false; // establecemos si este componente es modal o no
  @Input() accion: string = LS.ACCION_LISTAR;
  public constantes: any = LS;
  public parametrosListado: any = null;
  public items: MenuItem[];
  
  constructor(
    private utilService: UtilService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    if (!this.isModal) {
      this.items = this.utilService.generarItemsMenuesPaUbigeos(this);
    }
    this.parametrosListado = {
      accion: this.accion,
      activos: false,
      isModal: this.isModal
    };
  }

  // proviene del menu
  nuevo() {
    this.parametrosListado = {
      accion: LS.ACCION_NUEVO, // accion nuevo
      isModal: this.isModal
    }
  }

  consultarGeneral(activos: boolean) {
    this.parametrosListado = {
      listar: true,
      activos,
      isModal: this.isModal
    };
  }

  // Metodos para abrir los modales
  // abrirUbigeos() {
  //   const modalRef = this.modalService.open(ModalUbigeoComponent, {size: 'lg', keyboard: true});
  //   modalRef.result.then((result) => {
  //   }, (reason) => {
  //   });
  // }

  nuevoTipoUbigeo() {
    const modalRef = this.modalService.open(ModalTipoubigeoComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  // editarUbigeo(id) {
  //   const modalRef = this.modalService.open(ModalUbigeoComponent, {size: 'lg', keyboard: true});
  //   // asi... le pasamos el parametro id del usuario en el modal-usuario
  //   modalRef.componentInstance.edit = id;
  //   modalRef.result.then((result) => {
  //     this.listarUbigeos();
  //   }, (reason) => {
  //   });
  // }

  // paginate(event) {
  //   this.ubigeos = this.ubigeosCopia.slice(event.first, event.first+event.rows);
  // }
}
