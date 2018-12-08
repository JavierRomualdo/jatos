import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(
    private api: ApiRequest2Service,
    private toastr: ToastrService, // para mensajes de exito o error
  ) { }

  listarPersonas(contexto) {
    this.api.get2('personas').then(
      (res) => {
        if (res.length>0) {
          contexto.despuesDeListarPersonas(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  ingresarPersona(parametro, contexto) {
    this.api.post2('personas', parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha ingresado correctamente', 'Exito');
          contexto.despuesDeIngresarPersona(res);
        } else {
          this.toastr.warning('Error al ingresar ubigeo', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  modificarPersona(parametro, contexto) {
    this.api.put2('personas/' + parametro.id, parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado correctamente', 'Exito');
          contexto.despuesDeModificarPersona(res);
        } else {
          this.toastr.warning('Error al modificar casa', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  cambiarEstadoPersona(parametro, contexto) {
    this.api.delete2('personas/' + parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado el estado', 'Exito');
          contexto.despuesDeCambiarEstadoPersona(res);
        } else {
          this.toastr.warning('Error al modificar estado', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  mostrarPersona(parametro, contexto) {
    this.api.get2('personas/' + parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeMostrarPersona(res);
        } else {
          this.toastr.warning('Error al mostrar ubigeo', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  busquedaPersonas(parametro, contexto) {
    this.api.post2('buscarpersona', parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeBusquedaPersonas(res);
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
