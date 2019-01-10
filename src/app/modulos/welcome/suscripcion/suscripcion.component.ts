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
    let parametros = {
      nombres: this.mensaje.nombres,
      telefono: this.mensaje.telefono,
      email: this.mensaje.email,
      titulo: this.mensaje.titulo,
      mensaje: this.mensaje.mensaje
    }
    this.enviarCorreo(parametros);
    // this.toastr.success('Mensaje enviado');
    // this.mensaje = new CasaMensaje();
    // this.cargando = false;
  }

  enviarCorreo(parametros) {
    this.cargando = true;
    this.api.post2('enviarMensajeContacto', parametros).then(
      (data) => {
        console.log('se ha enviado correo: ');
        console.log(data);
        this.toastr.success('Mensaje enviado');
        this.mensaje = new CasaMensaje();
        this.cargando = false;
        
      },
      (error) => {
        
      }
    ).catch(err => this.handleError(err));
  }

  private handleError(error: any): void {
    // this.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }
}
