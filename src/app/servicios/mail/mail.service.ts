import { Injectable } from '@angular/core';
import { LS } from 'src/app/contantes/app-constants';
import { ApiRequest2Service } from '../api-request2.service';
import { UtilService } from '../util/util.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  public constantes: any = LS;
  
  constructor(
    private api: ApiRequest2Service,
    private utilService: UtilService,
    private toastr: ToastrService,
    ) { }

  reenviarCorreoPaCliente(parametro, contexto) {
    this.api.post2('reenviarMensajeCliente', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeReenviarCorreoPaCliente(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  // Mensajes de que envia el cliente por propiedad

  private handleError(error: any, contexto): void {
    this.toastr.error('Error Interno: ' + error, 'Error');
    contexto.cargando = false;
  }
}
