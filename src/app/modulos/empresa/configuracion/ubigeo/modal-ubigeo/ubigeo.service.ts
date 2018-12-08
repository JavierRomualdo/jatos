import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {

  constructor(
    private api: ApiRequest2Service,
    public toastr: ToastrService,
  ) { }

  litarUbigeos(contexto) {
    this.api.get2('ubigeos').then(
      (res) => {
        if (res.length>0) {
          contexto.despuesDeListarUbigeos(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  ingresarUbigeo(parametro, contexto) {
    this.api.post2('ubigeos', parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha ingresado correctamente', 'Exito');
          contexto.despuesDeIngresarUbigeo(res);
        } else {
          this.toastr.warning('Error al ingresar ubigeo', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  modificarUbigeo(parametro, contexto) {
    this.api.put2('ubigeos/' + parametro.ubigeo.id, parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado correctamente', 'Exito');
          contexto.despuesDeModificarUbigeo(res);
        } else {
          this.toastr.warning('Error al modificar casa', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  cambiarEstadoUbigeo(parametro, contexto) {
    this.api.delete2('ubigeos/' + parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado el estado', 'Exito');
          contexto.despuesDeCambiarEstadoUbigeo(res);
        } else {
          this.toastr.warning('Error al modificar estado', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  mostrarUbigeo(parametro, contexto) {
    this.api.get2('ubigeos/' + parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeMostrarUbigeo(res);
        } else {
          this.toastr.warning('Error al mostrar ubigeo', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  mostrarUbigeos(parametro, contexto) {
    this.api.get2('mostrarubigeos/' + parametro.idtipoubigeo + '/' + parametro.codigo).then(
      (res) => {
        if (res) {
          if (parametro.idtipoubigeo === 1) { // departamento
            // listo las provincias del departamento
            contexto.despuesDeMostrarUbigeosProvincias(res);
          } else if (parametro. idtipoubigeo === 2) { // provincia
            // listo los distritos de la provincia
            contexto.despuesDeMostrarUbigeosDistritos(res);
          }
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  busquedaUbigeos(parametro, contexto) {
    this.api.post2('buscarubigeos', parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeBusquedaUbigeos(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
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
