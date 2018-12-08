import { Injectable } from '@angular/core';
import { ApiRequest2Service } from '../api-request2.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class FotosService {

  constructor(
    private api: ApiRequest2Service,
    private toastr: ToastrService,
  ) { }

  ingresarDetalleFoto(parametro, contexto) {
    this.api.put2('fotos/' + parametro.id, parametro).then(
      (res) => {
        contexto.despuesDeIngresarDetalleFoto(res);
      },
      (error) => {
        console.log('error: ');
      }
    ).catch(err => this.handleError(err, contexto));
  }

  private handleError(error: any, contexto): void {
    contexto.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }
}
