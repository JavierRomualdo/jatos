import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from 'src/app/servicios/util/util.service';
import { LS } from 'src/app/contantes/app-constants';
import { ImagenAccionComponent } from 'src/app/modulos/componentes/imagen-accion/imagen-accion.component';
import { IconAccionComponent } from 'src/app/modulos/componentes/icon-accion/icon-accion.component';
import { InputEstadoComponent } from 'src/app/modulos/componentes/input-estado/input-estado.component';
import { BotonOpcionesComponent } from 'src/app/modulos/componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from 'src/app/modulos/componentes/tooltip-reader/tooltip-reader.component';
import { PinnedCellComponent } from 'src/app/modulos/componentes/pinned-cell/pinned-cell.component';

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {

  constructor(
    private api: ApiRequest2Service,
    private utilService: UtilService,
    private toastr: ToastrService,
  ) { }

  listarHabitaciones(parametro, contexto) {
    this.api.post2('listarHabitaciones', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarHabitaciones(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarHabitaciones([]);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  listarHabitacionesParaTipoContrato(parametro, contexto) {
    this.api.post2('listarHabitacionesParaTipoContrato', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarHabitacionesParaTipoContrato(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarHabitacionesParaTipoContrato([]);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  listarHabitacionesPorEstadoContrato(parametro, contexto) {
    this.api.post2('listarHabitacionesPorEstadoContrato', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarHabitacionesPorEstadoContrato(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarHabitacionesPorEstadoContrato([]);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  generarCodigoHabitacion(contexto) {
    this.api.get2('generarCodigoHabitacion').then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeGenerarCodigoHabitacion(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  ingresarHabitacion(parametro, contexto) {
    this.api.post2('habitaciones', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeIngresarHabitacion(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  modificarHabitacion(parametro, contexto) {
    this.api.put2('habitaciones/' + parametro.id, parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeModificarHabitacion(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  mostrarHabitacion(parametro, contexto) {
    this.api.get2('habitaciones/' + parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeMostrarHabitacion(data.extraInfo);
        } else {
          this.toastr.warning('Error al mostrar ubigeo', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  cambiarEstadoHabitacion(parametro, contexto) {
    this.api.post2('cambiarEstadoHabitacion', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesCambiarEstadoHabitacion(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  eliminarHabitacion(parametro, contexto) {
    this.api.delete2('habitaciones/'+parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeEliminarHabitacion(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  busquedaHabitaciones(parametro, contexto) {
    this.api.post2('buscarhabitacion', parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeBusquedaHabitaciones(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  // Mensajes
  cambiarEstadoMensajeHabitacion(parametro, contexto) {
    this.api.delete2('habitacionmensaje/' + parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success('Se ha modificado el estado mensaje', 'Exito');
          contexto.despuesCambiarEstadoMensajeHabitacion(data);
        } else {
          this.toastr.warning('Error al modificar estado mensahe', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  listarMensajesHabitacion(parametro, contexto) {
    this.api.get2('mostrarhabitacionmensajes/' + parametro.habitacion_id + '/' + parametro.valor).then(
      (res) => {
        if (res) {
          contexto.despuesDeListarMensajesHabitacion(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  eliminarFotoHabitacion(parametro, contexto) {
    this.api.delete2('habitacionfoto/' + parametro.id).then(
      (res) => {
        const index = contexto.fotos.indexOf(parametro);
        contexto.fotos.splice(index, 1);
        contexto.despuesDeEliminarFotoHabitacion(res);
      },
      (error) => {
        console.log('error: ');
      }
    ).catch(err => this.handleError(err, contexto));
  }

  private handleError(error: any, contexto): void {
    this.toastr.error('Error Interno: ' + error, 'Error');
    contexto.cargando = false;
  }

  generarColumnas(isModal: boolean): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_CODIGO,
        width: 100,
        minWidth: 100,
        valueGetter: (params) => {
          return params.data.codigo;
        }
      },
      {
        headerName: LS.TAG_IMAGEN,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'foto',
        width: 115,
        minWidth: 115,
        cellRendererFramework: ImagenAccionComponent,
        cellClass: 'text-md-center'
      },
      {
        headerName: 'Contrato',
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'contrato',
        width: 115,
        minWidth: 115,
        cellRendererFramework: IconAccionComponent,
        cellClass: 'text-md-center'
      },
      {
        headerName: 'Estado Contrato',
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'estadocontrato',
        width: 140,
        minWidth: 140,
        cellRendererFramework: IconAccionComponent,
        cellClass: 'text-md-center'
      },
      {
        headerName: LS.TAG_PROPIETARIO,
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          return params.data.propietario;
        }
      },
      {
        headerName: LS.TAG_UBICACION,
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          return params.data.ubicacion;
        }
      },
      {
        headerName: LS.TAG_DIRECCION,
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          return params.data.direccion;
        }
      },
      {
        headerName: LS.TAG_AREA,
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          return params.data.largo + " x " + params.data.ancho +" m2";
        }
      },
      {
        headerName: LS.TAG_PRECIO_ADQUISICION,
        width: 140,
        minWidth: 140,
        valueGetter: (params) => {
          return params.data.precioadquisicion;
        }
      },
      {
        headerName: LS.TAG_PRECIO_CONTRATO,
        width: 125,
        minWidth: 125,
        valueGetter: (params) => {
          return params.data.preciocontrato;
        }
      },
      {
        headerName: LS.TAG_GANANCIA,
        width: 100,
        minWidth: 100,
        valueGetter: (params) => {
          return params.data.ganancia;
        }
      },
      {
        headerName: LS.TAG_CAMAS,
        width: 80,
        minWidth: 80,
        valueGetter: (params) => {
          return params.data.ncamas;
        }
      },
      {
        headerName: LS.TAG_BANIO_PREG,
        width: 90,
        minWidth: 90,
        valueGetter: (params) => {
          return params.data.tbanio ? 'SI' : 'NO';
        }
      }
    );
    if (!isModal) {
      columnas.push(
        {
          headerName: LS.TAG_ACTIVO,
          headerClass: 'text-md-center',//Clase a nivel de th
          field: 'estado',
          width: 90,
          minWidth: 90,
          cellRendererFramework: InputEstadoComponent,
          cellClass: 'text-md-center'
        },
        {
          headerName: LS.TAG_OPCIONES,
          headerClass: 'cell-header-center',//Clase a nivel de th
          cellClass: (params) => { return (params.data.estadocontrato !=='L') ? 'd-none' : 'text-center' },
          width: LS.WIDTH_OPCIONES,
          minWidth: LS.WIDTH_OPCIONES,
          maxWidth: LS.WIDTH_OPCIONES,
          cellRendererFramework: BotonOpcionesComponent,
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            class: LS.ICON_OPCIONES,
            tooltip: LS.TAG_OPCIONES,
            text: '',
            enableSorting: false
          },
          pinnedRowCellRenderer: PinnedCellComponent,
        },
        // this.utilService.getColumnaOpciones()
      );
    } else {
      columnas.push(
        this.utilService.getSpanSelect()
      )
    }
    return columnas;
  }
}
