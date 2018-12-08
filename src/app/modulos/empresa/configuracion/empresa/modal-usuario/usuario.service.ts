import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private api: ApiRequest2Service,
    private toastr: ToastrService,
  ) { }

  listarUsuarios(contexto) {
    this.api.get2('usuarios').then(
      (res) => {
        if (res.length>0) {
          contexto.despuesDeListarUsuarios(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  ingresarUsuario(parametro, contexto) {
    this.api.post2('usuarios', parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha ingresado correctamente', 'Exito');
          contexto.despuesDeIngresarUsuario(res);
        } else {
          this.toastr.warning('Error al ingresar ubigeo', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  modificarUsuario(parametro, contexto) {
    this.api.put2('usuarios/' + parametro.id, parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado correctamente', 'Exito');
          contexto.despuesDeModificarUsuario(res);
        } else {
          this.toastr.warning('Error al modificar casa', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  cambiarEstadoUsuario(parametro, contexto) {
    this.api.delete2('usuarios/' + parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado el estado', 'Exito');
          contexto.despuesDeCambiarEstadoUsuario(res);
        } else {
          this.toastr.warning('Error al modificar estado', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  mostrarUsuario(parametro, contexto) {
    this.api.get2('usuarios/' + parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeMostrarUsuario(res);
        } else {
          this.toastr.warning('Error al mostrar ubigeo', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  busquedaUsuarios(parametro, contexto) {
    this.api.post2('buscarusuario', parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeBusquedaUsuarios(res);
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
