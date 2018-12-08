import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.css']
})
export class ConfirmacionComponent implements OnInit {

  constructor(
    private modal: NgbModal,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  open(content) {
    // this.modal.open(content, { windowClass: 'dark-modal' });
  }
}
