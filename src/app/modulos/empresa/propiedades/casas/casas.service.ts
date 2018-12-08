import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CasasService {

  constructor(
    private api: ApiRequest2Service,
    public toastr: ToastrService,
  ) { }

  listarCasas(contexto) {
    this.api.get2('casas').then(
      (res) => {
        if (res.length>0) {
          contexto.despuesDeListarCasas(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  ingresarCasa(parametro, contexto) {
    this.api.post2('casas', parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha ingresado correctamente', 'Exito');
          contexto.despuesDeIngresarCasa(res);
        } else {
          this.toastr.warning('Error al ingresar casa', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  modificarCasa(parametro, contexto) {
    this.api.put2('casas/' + parametro.id, parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado correctamente', 'Exito');
          contexto.despuesDeModificarCasa(res);
        } else {
          this.toastr.warning('Error al modificar casa', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  busquedaCasas(parametro, contexto) {
    this.api.post2('buscarcasa', parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeBusquedaCasas(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  cambiarEstadoCasa(parametro, contexto) {
    this.api.delete2('casas/' + parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado el estado', 'Exito');
          contexto.despuesCambiarEstadoCasa(res);
        } else {
          this.toastr.warning('Error al modificar estado', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  mostrarCasa(parametro, contexto) {
    this.api.get2('casas/' + parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeMostrarCasa(res);
        } else {
          this.toastr.warning('Error al mostrar ubigeo', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  cambiarEstadoMensajeCasa(parametro, contexto) {
    this.api.delete2('casamensaje/' + parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado el estado mensaje', 'Exito');
          contexto.despuesCambiarEstadoMensajeCasa(res);
        } else {
          this.toastr.warning('Error al modificar estado mensahe', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  listarMensajesCasa(parametro, contexto) {
    this.api.get2('mostrarcasamensajes/' + parametro.casa_id + '/' + parametro.valor).then(
      (res) => {
        if (res) {
          contexto.despuesDeListarMensajesCasa(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  eliminarFotoCasa(parametro, contexto) {
    this.api.delete2('casafoto/' + parametro.id).then(
      (res) => {
        const index = contexto.fotos.indexOf(parametro);
        contexto.fotos.splice(index, 1);
        contexto.despuesDeEliminarFotoCasa(res);
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
