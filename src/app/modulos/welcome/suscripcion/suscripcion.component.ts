import { Component, OnInit } from '@angular/core';
import { ApiRequest2Service } from '../../../servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { CasaMensaje } from '../../../entidades/entidad.casamensaje';

@Component({
  selector: 'app-suscripcion',
  templateUrl: './suscripcion.component.html',
  styleUrls: ['./suscripcion.component.css']
})
export class SuscripcionComponent implements OnInit {

  public mensaje: CasaMensaje;
  public cargando: Boolean = false;

  constructor(
    public api: ApiRequest2Service,
    public toastr: ToastrService,
  ) {
    this.mensaje = new CasaMensaje();
  }

  ngOnInit() {
  }

  enviarmensaje() {
    this.cargando = true;
    console.log('mi mensaje: ');
    console.log(this.mensaje);
    this.toastr.success('Mensaje enviado');
    this.mensaje = new CasaMensaje();
    this.cargando = false;
  }

}
