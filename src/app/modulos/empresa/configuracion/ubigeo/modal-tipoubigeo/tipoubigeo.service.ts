import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class TipoubigeoService {

  constructor(
    private api: ApiRequest2Service,
    private toastr: ToastrService,
  ) { }

  listarTipoUbigeos(contexto) {
    this.api.get2('tipoubigeos').then(
      (res) => {
        if (res.length > 0) {
          contexto.despuesDeListarTipoUbigeos(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  ingresarTipoUbigeo(parametro, contexto) {
    this.api.post2('tipoubigeos', parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha ingresado correctamente', 'Exito');
          contexto.despuesDeIngresarTipoUbigeo(res);
        } else {
          this.toastr.warning('Error al ingresar tipo ubigeo', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  modificarTipoUbigeo(parametro, contexto) {
    this.api.put2('tipoubigeos/' + parametro.id, parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado correctamente', 'Exito');
          contexto.despuesDeModificarTipoUbigeo(res);
        } else {
          this.toastr.warning('Error al modificar casa', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  mostrarTipoUbigeo(parametro, contexto) {
    this.api.get2('tipoubigeos/' + parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeMostrarTipoUbigeo(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  busquedaTipoUbigeos(parametro, contexto) {
    this.api.post2('buscartipoubigeo', parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeBusquedaTipoUbigeos(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  cambiarEstadoTipoUbigeo(parametro, contexto) {
    this.api.delete2('tipoubigeos/' + parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado el estado', 'Exito');
          contexto.despuesDeCambiarEstadoTipoUbigeo(res);
        } else {
          this.toastr.warning('Error al modificar estado', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  private handleError(error: any, contexto): void {
    contexto.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }
}
