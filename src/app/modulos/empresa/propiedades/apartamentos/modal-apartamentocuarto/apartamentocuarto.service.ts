import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ApartamentocuartoService {

  constructor(
    private api: ApiRequest2Service,
    private toastr: ToastrService,
  ) { }

  listarApartamentoCuartos(contexto) {
    this.api.get2('apartamentocuartos').then(
      (res) => {
        if (res.length>0) {
          contexto.despuesDeListarApartamentoCuartos(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  ingresarApartamentoCuarto(parametro, contexto) {
    this.api.post2('apartamentocuartos', parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha ingresado correctamente', 'Exito');
          contexto.despuesDeIngresarApartamentoCuarto(res);
        } else {
          this.toastr.warning('Error al ingresar ubigeo', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  modificarApartamentoCuarto(parametro, contexto) {
    this.api.put2('apartamentocuartos/' + parametro.id, parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado correctamente', 'Exito');
          contexto.despuesDeModificarApartamentoCuarto(res);
        } else {
          this.toastr.warning('Error al modificar casa', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  cambiarEstadoApartamentoCuarto(parametro, contexto) {
    this.api.delete2('apartamentocuartos/' + parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado el estado', 'Exito');
          contexto.despuesDeCambiarEstadoApartamentoCuarto(res);
        } else {
          this.toastr.warning('Error al modificar estado', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  mostrarApartamentoCuarto(parametro, contexto) {
    this.api.get2('apartamentocuartos/' + parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeMostrarApartamentoCuarto(res);
        } else {
          this.toastr.warning('Error al mostrar ubigeo', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  listarMensajesApartamentoCuarto(parametro, contexto) {
    this.api.get2('mostrarapartamentocuartomensajes/' + parametro.apartamentocuarto_id + '/' + parametro.valor).then(
      (res) => {
        if (res) {
          contexto.despuesDeListarMensajesApartamentoCuarto(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  busquedaApartamentoCuartos(parametro, contexto) {
    this.api.post2('buscarapartamentocuarto', parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeBusquedaApartamentoCuartos(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  cambiarEstadoMensajeApartamentoCuarto(parametro, contexto) {
    this.api.delete2('apartamentocuartomensaje/' + parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado el estado mensaje', 'Exito');
          contexto.despuesCambiarEstadoMensajeApartamentoCuarto(res);
        } else {
          this.toastr.warning('Error al modificar estado mensahe', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  eliminarFotoApartamentoCuarto(parametro, contexto) {
    this.api.delete2('apartamentofoto/' + parametro.id).then(
      (res) => {
        const index = contexto.fotos.indexOf(parametro);
        contexto.fotos.splice(index, 1);
        contexto.despuesDeEliminarFotoApartamentoCuarto(res);
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
