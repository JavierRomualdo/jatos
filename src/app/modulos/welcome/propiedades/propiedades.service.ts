import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from 'src/app/contantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class PropiedadesService {

  constructor(
    private api: ApiRequest2Service,
    public toastr: ToastrService,
  ) { }

  busquedaPropiedad(parametro, contexto) {
    this.api.post2('busquedaPropiedad', parametro).then(
      (data) => {
        contexto.despuesDeBusquedaPropiedad(data);
      }
    ).catch(err => this.handleError(err, contexto));
  }

  private handleError(error: any, contexto): void {
    contexto.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }
}
