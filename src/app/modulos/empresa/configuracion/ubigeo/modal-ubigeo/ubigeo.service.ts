import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from 'src/app/servicios/util/util.service';
import { LS } from 'src/app/contantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {

  constructor(
    private api: ApiRequest2Service,
    private utilService: UtilService,
    private toastr: ToastrService,
  ) { }

  litarUbigeos(contexto) {
    this.api.get2('ubigeos').then(
      (res) => {
        if (res.length>0) {
          contexto.despuesDeListarUbigeos(res);
        } else {
          this.toastr.warning('No se encontraron resultados', LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  ingresarUbigeo(parametro, contexto) {
    this.api.post2('ubigeos', parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha ingresado correctamente', LS.TAG_EXITO);
          contexto.despuesDeIngresarUbigeo(res);
        } else {
          this.toastr.warning('Error al ingresar ubigeo', LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  modificarUbigeo(parametro, contexto) {
    this.api.put2('ubigeos/' + parametro.ubigeo.id, parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado correctamente', LS.TAG_EXITO);
          contexto.despuesDeModificarUbigeo(res);
        } else {
          this.toastr.warning('Error al modificar casa', LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  cambiarEstadoUbigeo(parametro, contexto) {
    this.api.delete2('ubigeos/' + parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado el estado', LS.TAG_EXITO);
          contexto.despuesDeCambiarEstadoUbigeo(res);
        } else {
          this.toastr.warning('Error al modificar estado', LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  mostrarUbigeo(parametro, contexto) {
    this.api.get2('ubigeos/' + parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeMostrarUbigeo(res);
        } else {
          this.toastr.warning('Error al mostrar ubigeo', LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  mostrarUbigeos(parametro, contexto) {
    this.api.get2('mostrarubigeos/' + parametro.idtipoubigeo + '/' + parametro.codigo).then(
      (res) => {
        if (res) {
          if (parametro.idtipoubigeo === 1) { // departamento
            // listo las provincias del departamento
            contexto.despuesDeMostrarUbigeosProvincias(res);
          } else if (parametro.idtipoubigeo === 2) { // provincia
            // listo los distritos de la provincia
            contexto.despuesDeMostrarUbigeosDistritos(res);
          } else if (parametro.idtipoubigeo === 3) { // distrito
            contexto.despuesDeMostrarUbigeosHabilitacionUrbanas(res);
          }
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  busquedaUbigeos(parametro, contexto) {
    this.api.post2('buscarubigeos', parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeBusquedaUbigeos(res);
        } else {
          this.toastr.warning('No se encontraron resultados', LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  searchUbigeo(parametro, contexto) {
    this.api.get2('searchUbigeo/'+parametro).then(
      (res) => {
        contexto.despuesDeSearchUbigeo(res);
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }
}
