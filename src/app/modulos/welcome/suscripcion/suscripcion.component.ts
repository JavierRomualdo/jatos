import { Component, OnInit } from '@angular/core';
import { ApiRequest2Service } from '../../../servicios/api-request2.service';
import { CasaMensaje } from '../../../entidades/entidad.casamensaje';
import { LS } from 'src/app/contantes/app-constants';
import { MailService } from 'src/app/servicios/mail/mail.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-suscripcion',
  templateUrl: './suscripcion.component.html',
  styleUrls: ['./suscripcion.component.css']
})
export class SuscripcionComponent implements OnInit {

  public mensaje: CasaMensaje;
  public cargando: boolean = false;

  constructor(
    public api: ApiRequest2Service,
    private mensajeService: MailService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle( LS.PAGINA_CONTACTO );
    this.mensaje = new CasaMensaje();
  }

  enviarmensaje() {
    this.cargando = true;
    let parametros = {
      nombres: this.mensaje.nombres,
      telefono: this.mensaje.telefono,
      email: this.mensaje.email,
      titulo: this.mensaje.titulo,
      mensaje: this.mensaje.mensaje,
      emailReceptor: LS.KEY_EMPRESA_SELECT ? LS.KEY_EMPRESA_SELECT.correo : 'javierromualdo2014@gmail.com'
    }
    this.mensajeService.enviarMensajeContacto(parametros, this);
  }

  despuesDeEnviarMensajeContacto(data) {
    if (data) {
      this.mensaje = new CasaMensaje();
    }
    this.cargando = false;
  }
}
