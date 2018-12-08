import { Component, OnInit } from '@angular/core';
import { Lote } from 'src/app/entidades/entidad.lote';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Persona } from 'src/app/entidades/entidad.persona';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { ModalLoteComponent } from './modal-lote/modal-lote.component';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { LoteService } from './lote.service';

@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.css']
})
export class LotesComponent implements OnInit {

  public cargando: Boolean = false;
  public confirmarcambioestado: Boolean = false;
  public lotes: any = []; // lista lotes
  public parametros: Lote;

  constructor(
    private modalService: NgbModal,
    private loteService: LoteService,
    private toastr: ToastrService
  ) {
    this.parametros = new Lote();
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
  }

  ngOnInit() {
    this.listarLotes();
  }

  limpiar() {
    this.parametros = new Lote();
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
    this.lotes = [];
    this.listarLotes();
  }

  busqueda() {
    let nohayvacios: Boolean = false;
    if (this.parametros.persona_id.nombres !== undefined &&
      this.parametros.persona_id.nombres !== '') {
        nohayvacios = true;
      }
    if (this.parametros.ubigeo_id.ubigeo !== undefined && this.parametros.ubigeo_id.ubigeo !== '') {
      nohayvacios = true;
    }
    if (this.parametros.direccion !== undefined && this.parametros.direccion !== '') {
      nohayvacios = true;
    }
    if (nohayvacios) {
      this.cargando = true;
      console.log(this.parametros);
      this.loteService.busquedaLotes(this.parametros, this);
    } else {
      this.toastr.warning('Verifique los datos ingresados.', 'Datos inválidos');
    }
  }

  despuesDeBusquedaLotes(data) {
    console.log(data);
    this.lotes = data;
    this.cargando = false;
  }

  abrirLotes(): void {
    const modalRef = this.modalService.open(ModalLoteComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
      this.listarLotes();
    }, (reason) => {
    });
  }

  editarLote(id) {
    const modalRef = this.modalService.open(ModalLoteComponent, {size: 'lg', keyboard: true});
    modalRef.componentInstance.edit = id;
    modalRef.result.then((result) => {
      this.listarLotes();
    }, (reason) => {
    });
  }

  confirmarcambiodeestado(lote): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoservicio(lote);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      lote.estado = !lote.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoservicio(lote) {
    this.cargando = true;
    this.loteService.cambiarEstadoLote(lote.id, this);
  }

  despuesDeCambiarEstadoLote(data) {
    console.log(data);
    this.listarLotes();
    this.cargando = false;
  }

  listarLotes() {
    this.cargando = true;
    this.loteService.listarLotes(this);
  }

  despuesDeListarLotes(data) {
    this.lotes = data;
    this.cargando = false;
    console.log('resultado: ');
    console.log(this.lotes);
  }
}
