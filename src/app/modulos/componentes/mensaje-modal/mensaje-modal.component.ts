import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MensajeTO } from 'src/app/entidadesTO/empresa/MensajeTO';
import { LS } from 'src/app/contantes/app-constants';

@Component({
  selector: 'app-mensaje-modal',
  templateUrl: './mensaje-modal.component.html',
  styleUrls: ['./mensaje-modal.component.css']
})
export class MensajeModalComponent implements OnInit {

  @Input() parametros;
  @Output() displayChange = new EventEmitter();
  
  public display: boolean = false;
  public mensaje: MensajeTO;
  public constantes: any = LS;
  public accion: string = null;
  public tituloForm: string = null;

  constructor() { }

  ngOnInit() {
    if (this.parametros) {
      this.display = this.parametros.display;
      this.mensaje = this.parametros.mensaje;
      this.accion = this.parametros.accion;
      this.tituloForm = "Mensaje - " + this.parametros.codigo;
    }
  }

  onClose(){
    this.displayChange.emit(false);
  }

  // Work against memory leak if component is destroyed
  ngOnDestroy() {
    this.displayChange.unsubscribe();
  }
}
