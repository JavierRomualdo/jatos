import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from 'src/app/contantes/app-constants';
import { UtilService } from 'src/app/servicios/util/util.service';
import { ArchivoService } from 'src/app/servicios/archivo/archivo.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(
    private api: ApiRequest2Service,
    private archivoService: ArchivoService,
    private utilService: UtilService,
    private toastr: ToastrService,
  ) { }

  listarEmpresa(contexto) {
    this.api.get2('empresa').then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarEmpresa(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.imagenAnterior = undefined;
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  ingresarEmpresa(parametro, contexto) {
    this.api.post2('empresa', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeIngresarEmpresa(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  modificarEmpresa(parametro, contexto) {
    this.api.put2('empresa/' + parametro.id, parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeModificarEmpresar(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirEmpresa(parametro, contexto) {
    this.archivoService.postPdf("imprimirReporteEmpresa", parametro).then(
      (data) => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('Empresa_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }
}
