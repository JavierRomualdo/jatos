import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LS } from 'src/app/contantes/app-constants';
import { MailTO } from 'src/app/entidadesTO/welcome/MailTO';
import { MailServiceService } from 'src/app/servicios/mail/mail-service.service';

@Component({
  selector: 'app-formulario-mail',
  templateUrl: './formulario-mail.component.html',
  styleUrls: ['./formulario-mail.component.css']
})
export class FormularioMailComponent implements OnInit {

  @Input() parametros;
  @Output() displayChange = new EventEmitter();

  public display: boolean = false;
  public mail: MailTO;
  public constantes: any = LS;
  public accion: string = null;
  public tituloForm: string = null;
  public cargando: boolean = false;

  constructor(
    private mailService: MailServiceService
  ) { }

  ngOnInit() {
    this.mail = new MailTO();
    if (this.parametros) {
      this.display = this.parametros.display;
      this.mail.nombres = this.parametros.mensajeTO.nombres;
      this.mail.emailReceptor = this.parametros.mensajeTO.email;
      this.accion = this.parametros.accion;
      this.tituloForm = "Enviar correo - " + this.parametros.codigo;
    }
  }

  enviarCorreo() {
    this.cargando = true;
    console.log(this.mail);
    this.mailService.reenviarCorreoPaCliente(this.mail, this);
  }

  despuesDeReenviarCorreoPaCliente(data) {
    this.cargando = false;
  }

  onClose(){
    this.displayChange.emit(false);
  }

  // Work against memory leak if component is destroyed
  ngOnDestroy() {
    this.displayChange.unsubscribe();
  }
}
