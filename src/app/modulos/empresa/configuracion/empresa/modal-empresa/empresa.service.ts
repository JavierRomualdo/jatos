import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(
    private api: ApiRequest2Service,
    private toastr: ToastrService,
  ) { }

  listarEmpresa(contexto) {
    this.api.get2('empresa').then(
      (res) => {
        if (res !== 'vacio') {
          contexto.despuesDeListarEmpresa(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.imagenAnterior = undefined;
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  ingresarEmpresa(parametro, contexto) {
    this.api.post2('empresa', parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha ingresado correctamente', 'Exito');
          contexto.despuesDeIngresarEmpresa(res);
        } else {
          this.toastr.warning('Error al ingresar ubigeo', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  modificarEmpresa(parametro, contexto) {
    this.api.put2('empresa/' + parametro.id, parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado correctamente', 'Exito');
          contexto.despuesDeModificarEmpresar(res);
        } else {
          this.toastr.warning('Error al modificar casa', 'Aviso');
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
