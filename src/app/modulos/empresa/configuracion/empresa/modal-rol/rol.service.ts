import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(
    private api: ApiRequest2Service,
    private toastr: ToastrService,
  ) { }

  listarRoles(contexto) {
    this.api.get2('roles').then(
      (res) => {
        if (res.length>0) {
          contexto.despuesDeListarRoles(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  ingresarRol(parametro, contexto) {
    this.api.post2('roles', parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha ingresado correctamente', 'Exito');
          contexto.despuesDeIngresarRol(res);
        } else {
          this.toastr.warning('Error al ingresar ubigeo', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  modificarRol(parametro, contexto) {
    this.api.put2('roles/' + parametro.id, parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado correctamente', 'Exito');
          contexto.despuesDeModificarRol(res);
        } else {
          this.toastr.warning('Error al modificar casa', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  cambiarEstadoRol(parametro, contexto) {
    this.api.delete2('roles/' + parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado el estado', 'Exito');
          contexto.despuesDeCambiarEstadoRol(res);
        } else {
          this.toastr.warning('Error al modificar estado', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  mostrarRol(parametro, contexto) {
    this.api.get2('roles/' + parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeMostrarRol(res);
        } else {
          this.toastr.warning('Error al mostrar ubigeo', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  busquedaRoles(parametro, contexto) {
    this.api.post2('buscarrol', parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeBusquedaRoles(res);
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
