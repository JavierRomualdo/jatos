import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEmpresaComponent } from './modal-empresa/modal-empresa.component';
import { ModalRolComponent } from './modal-rol/modal-rol.component';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaConfiguracionComponent implements OnInit {
  
  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit() { }

  // Metodos para abrir los modales
  abrirDatos(): void {
    const modalRef = this.modalService.open(ModalEmpresaComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  abrirRoles() {
    const modalRef = this.modalService.open(ModalRolComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
}
