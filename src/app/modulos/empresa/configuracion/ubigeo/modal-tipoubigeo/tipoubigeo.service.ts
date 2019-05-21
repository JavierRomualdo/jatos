import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from 'src/app/servicios/util/util.service';
import { LS } from 'src/app/contantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class TipoubigeoService {

  constructor(
    private api: ApiRequest2Service,
    private utilService: UtilService,
    private toastr: ToastrService,
  ) { }

  listarTipoUbigeos(contexto) {
    this.api.get2('tipoubigeos').then(
      (res) => {
        if (res.length > 0) {
          contexto.despuesDeListarTipoUbigeos(res);
        } else {
          this.toastr.warning('No se encontraron resultados', LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  ingresarTipoUbigeo(parametro, contexto) {
    this.api.post2('tipoubigeos', parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha ingresado correctamente', LS.TAG_EXITO);
          contexto.despuesDeIngresarTipoUbigeo(res);
        } else {
          this.toastr.warning('Error al ingresar tipo ubigeo', LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  modificarTipoUbigeo(parametro, contexto) {
    this.api.put2('tipoubigeos/' + parametro.id, parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado correctamente', LS.TAG_EXITO);
          contexto.despuesDeModificarTipoUbigeo(res);
        } else {
          this.toastr.warning('Error al modificar casa', LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  mostrarTipoUbigeo(parametro, contexto) {
    this.api.get2('tipoubigeos/' + parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeMostrarTipoUbigeo(res);
        } else {
          this.toastr.warning('No se encontraron resultados', LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  busquedaTipoUbigeos(parametro, contexto) {
    this.api.post2('buscartipoubigeo', parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeBusquedaTipoUbigeos(res);
        } else {
          this.toastr.warning('No se encontraron resultados', LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  cambiarEstadoTipoUbigeo(parametro, contexto) {
    this.api.delete2('tipoubigeos/' + parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado el estado', LS.TAG_EXITO);
          contexto.despuesDeCambiarEstadoTipoUbigeo(res);
        } else {
          this.toastr.warning('Error al modificar estado', LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }
}
