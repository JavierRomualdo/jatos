import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from 'src/app/contantes/app-constants';
import { InputEstadoComponent } from 'src/app/modulos/componentes/input-estado/input-estado.component';
import { ImagenAccionComponent } from 'src/app/modulos/componentes/imagen-accion/imagen-accion.component';
import { UtilService } from 'src/app/servicios/util/util.service';

@Injectable({
  providedIn: 'root'
})
export class CasasService {

  constructor(
    private api: ApiRequest2Service,
    private utilService: UtilService,
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

  generarColumnas(isModal: boolean): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: 'Imagen',
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'foto',
        width: 115,
        minWidth: 115,
        cellRendererFramework: ImagenAccionComponent,
        cellClass: 'text-md-center'
      },
      {
        headerName: 'Propietario',
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          return params.data.nombres;
        }
      },
      {
        headerName: 'Ubicación',
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          return params.data.ubigeo;
        }
      },
      {
        headerName: 'Dirección',
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          return params.data.direccion;
        }
      },
      {
        headerName: 'Area',
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          return params.data.largo + " x " + params.data.ancho +" m2";
        }
      },
      {
        headerName: 'Precio',
        width: 100,
        minWidth: 100,
        valueGetter: (params) => {
          return params.data.precio;
        }
      },
      {
        headerName: 'Pisos',
        width: 80,
        minWidth: 80,
        valueGetter: (params) => {
          return params.data.npisos;
        }
      },
      {
        headerName: 'Cuartos',
        width: 90,
        minWidth: 90,
        valueGetter: (params) => {
          return params.data.ncuartos;
        }
      },
      {
        headerName: 'Banios',
        width: 80,
        minWidth: 80,
        valueGetter: (params) => {
          return params.data.nbanios;
        }
      },
      {
        headerName: 'Jardin',
        width: 80,
        minWidth: 80,
        valueGetter: (params) => {
          return params.data.tjardin ? 'SI' : 'NO';
        }
      },
      {
        headerName: 'Cochera',
        width: 90,
        minWidth: 90,
        valueGetter: (params) => {
          return params.data.tcochera ? 'SI' : 'NO';
        }
      }
    );
    if (!isModal) {
      columnas.push(
        {
          headerName: LS.TAG_INACTIVO,
          headerClass: 'text-md-center',//Clase a nivel de th
          field: 'estado',
          width: 115,
          minWidth: 115,
          cellRendererFramework: InputEstadoComponent,
          cellClass: 'text-md-center'
        },
        this.utilService.getColumnaOpciones()
      );
    }
    return columnas;
  }
}
