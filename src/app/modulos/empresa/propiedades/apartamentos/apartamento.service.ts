import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ApartamentoService {

  constructor(
    private api: ApiRequest2Service,
    private toastr: ToastrService,
  ) { }

  listarApartamentos(contexto) {
    this.api.get2('apartamentos').then(
      (res) => {
        if (res.length>0) {
          contexto.despuesDeListarApartamentos(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  ingresarApartamento(parametro, contexto) {
    this.api.post2('apartamentos', parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha ingresado correctamente', 'Exito');
          contexto.despuesDeIngresarApartamento(res);
        } else {
          this.toastr.warning('Error al ingresar ubigeo', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  modificarApartamento(parametro, contexto) {
    this.api.put2('apartamentos/' + parametro.id, parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado correctamente', 'Exito');
          contexto.despuesDeModificarApartamento(res);
        } else {
          this.toastr.warning('Error al modificar casa', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  cambiarEstadoApartamento(parametro, contexto) {
    this.api.delete2('apartamentos/' + parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado el estado', 'Exito');
          contexto.despuesDeCambiarEstadoApartamento(res);
        } else {
          this.toastr.warning('Error al modificar estado', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  mostrarApartamento(parametro, contexto) {
    this.api.get2('apartamentos/' + parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeMostrarApartamento(res);
        } else {
          this.toastr.warning('Error al mostrar ubigeo', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  listarMensajesApartamento(parametro, contexto) {
    this.api.get2('mostrarapartamentomensajes/' + parametro.apartamento_id + '/' + parametro.valor).then(
      (res) => {
        if (res) {
          contexto.despuesDeListarMensajesApartamento(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  busquedaApartamentos(parametro, contexto) {
    this.api.post2('buscarapartamento', parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeBusquedaApartamentos(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  cambiarEstadoMensajeApartamento(parametro, contexto) {
    this.api.delete2('apartamentomensaje/' + parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado el estado mensaje', 'Exito');
          contexto.despuesCambiarEstadoMensajeApartamento(res);
        } else {
          this.toastr.warning('Error al modificar estado mensahe', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  eliminarFotoApartamento(parametro, contexto) {
    this.api.delete2('apartamentofoto/' + parametro.id).then(
      (res) => {
        const index = contexto.fotos.indexOf(parametro);
        contexto.fotos.splice(index, 1);
        contexto.despuesDeEliminarFotoApartamento(res);
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
