import { Component, OnInit } from '@angular/core';
import { LS } from 'src/app/contantes/app-constants';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UbigeoService } from '../../configuracion/ubigeo/modal-ubigeo/ubigeo.service';
import { TipoubigeoService } from '../../configuracion/ubigeo/modal-tipoubigeo/tipoubigeo.service';
import { HabilitacionurbanaService } from '../../configuracion/habilitacionurbana/habilitacionurbana.service';
import { UtilService } from 'src/app/servicios/util/util.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-ubigeos-listado',
  templateUrl: './ubigeos-listado.component.html',
  styleUrls: ['./ubigeos-listado.component.css']
})
export class UbigeosListadoComponent implements OnInit {

  public parameros: any = LS;

  constructor(
    public activeModal: NgbActiveModal,
    private ubigeoService: UbigeoService,
    private tipoUbigeoService: TipoubigeoService,
    private habilitacionurbanaService: HabilitacionurbanaService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private modal: NgbModal,
    private auth: AuthService
  ) { }

  ngOnInit() {
  }

}
