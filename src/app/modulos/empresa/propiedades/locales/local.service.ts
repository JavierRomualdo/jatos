import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from 'src/app/contantes/app-constants';
import { ImagenAccionComponent } from 'src/app/modulos/componentes/imagen-accion/imagen-accion.component';
import { IconAccionComponent } from 'src/app/modulos/componentes/icon-accion/icon-accion.component';
import { InputEstadoComponent } from 'src/app/modulos/componentes/input-estado/input-estado.component';
import { BotonOpcionesComponent } from 'src/app/modulos/componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from 'src/app/modulos/componentes/tooltip-reader/tooltip-reader.component';
import { PinnedCellComponent } from 'src/app/modulos/componentes/pinned-cell/pinned-cell.component';
import { SpanMensajeComponent } from 'src/app/modulos/componentes/span-mensaje/span-mensaje.component';
import { UtilService } from 'src/app/servicios/util/util.service';
import { ArchivoService } from 'src/app/servicios/archivo/archivo.service';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor(
    private api: ApiRequest2Service,
    private archivoService: ArchivoService,
    private utilService: UtilService,
    private toastr: ToastrService,
  ) { }

  listarLocales(parametro, contexto) {
    this.api.post2('listarLocales', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarLocales(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarLocales([]);
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  listarLocalesParaTipoContrato(parametro, contexto) {
    this.api.post2('listarLocalesParaTipoContrato', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarLocalesParaTipoContrato(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarLocalesParaTipoContrato([]);
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  listarLocalesPorEstadoContrato(parametro, contexto) {
    this.api.post2('listarLocalesPorEstadoContrato', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarLocalesPorEstadoContrato(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarLocalesPorEstadoContrato([]);
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  generarCodigoLocal(contexto) {
    this.api.get2('generarCodigoLocal').then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeGenerarCodigoLocal(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  ingresarLocal(parametro, contexto) {
    this.api.post2('locales', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeIngresarLocal(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  modificarLocal(parametro, contexto) {
    this.api.put2('locales/' + parametro.id, parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeModificarLocal(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  cambiarEstadoLocal(parametro, contexto) {
    this.api.post2('cambiarEstadoLocal', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeCambiarEstadoLocal(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  mostrarLocal(parametro, contexto) {
    this.api.get2('locales/' + parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeMostrarLocal(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  listarMensajesLocal(parametro, contexto) {
    this.api.get2('mostrarcocheramensajes/' + parametro.cochera_id + '/' + parametro.valor).then(
      (res) => {
        if (res) {
          contexto.despuesDeListarMensajesLocal(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  eliminarLocal(parametro, contexto) {
    this.api.delete2('locales/'+parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeEliminarLocal(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  cambiarEstadoMensajeLocal(parametro, contexto) {
    this.api.delete2('cocheramensaje/' + parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado el estado mensaje', 'Exito');
          contexto.despuesCambiarEstadoMensajeLocal(res);
        } else {
          this.toastr.warning('Error al modificar estado mensahe', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  eliminarFotoLocal(parametro, contexto) {
    this.api.delete2('localfoto/' + parametro.id).then(
      (data) => {
        const index = contexto.fotos.indexOf(parametro);
        contexto.fotos.splice(index, 1);
        this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
        contexto.despuesDeEliminarFotoLocal(data);
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  eliminarArchivoLocal(parametro, contexto) {
    this.api.delete2('localarchivo/' + parametro.id).then(
      (data) => {
        const index = contexto.archivos.indexOf(parametro);
        contexto.archivos.splice(index, 1);
        this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
        contexto.despuesDeEliminarArchivoLocal(data);
      },
      (error) => {
        console.log('error: ');
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirLocales(parametro, contexto) {
    this.archivoService.postPdf("imprimirReporteLocales", parametro).then(
      (data) => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('ListadoLocales_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirLocalDetalle(parametro, contexto) {
    this.archivoService.postPdf("imprimirReporteLocalDetalle", parametro).then(
      (data) => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('DetalleLocal_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  exportarExcelLocales(parametro, contexto) {
    this.archivoService.postExcel("exportarExcelLocales", parametro).then(
      (data) => {
        if (data) {
          this.utilService.descargarArchivoExcel(data, "ListadoLocales_");
        } else {
          this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
    ).catch(err => this.utilService.handleError(err, contexto));
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
        headerClass: 'text-md-center',
        field: 'foto',
        width: 115,
        minWidth: 115,
        cellRendererFramework: ImagenAccionComponent,
        cellClass: 'text-md-center'
      },
      {
        headerName: LS.TAG_MENSAJES,
        headerClass: 'text-md-center',
        field: 'nmensajes',
        width: 95,
        minWidth: 95,
        cellRendererFramework: SpanMensajeComponent,
        cellClass: 'text-md-center'
      },
      {
        headerName: LS.TAG_CONTRATO,
        headerClass: 'text-md-center',
        field: 'contrato',
        width: 110,
        minWidth: 110,
        cellRendererFramework: IconAccionComponent,
        cellClass: 'text-md-center'
      },
      {
        headerName: LS.TAG_ESTADO_CONTRATO,
        headerClass: 'text-md-center',
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
        headerName: LS.TAG_HAB_URBANA,
        width: 115,
        minWidth: 115,
        valueGetter: (params) => {
          return params.data.siglas;
        }
      },
      {
        headerName: LS.TAG_UBICACION,
        width: 230,
        minWidth: 230,
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
        width: 100,
        minWidth: 100,
        valueGetter: (params) => {
          return `${params.data.largo} x ${params.data.ancho} m2`;
        }
      },
      {
        headerName: LS.TAG_PRECIO_ADQUISICION,
        width: 140,
        minWidth: 140,
        valueGetter: (params) => {
          return `S/. ${params.data.precioadquisicion}`;
        }
      },
      {
        headerName: LS.TAG_PRECIO_CONTRATO,
        width: 125,
        minWidth: 125,
        valueGetter: (params) => {
          return `S/. ${params.data.preciocontrato}`;
        }
      },
      {
        headerName: LS.TAG_GANANCIA,
        width: 100,
        minWidth: 100,
        valueGetter: (params) => {
          return `S/. ${params.data.ganancia}`;
        }
      },
      {
        headerName: LS.TAG_BANIO_PREG,
        width: 80,
        minWidth: 80,
        valueGetter: (params) => {
          return params.data.tbanio ? 'SI' : 'NO';
        }
      }
    );
    if (!isModal) {
      columnas.push(
        {
          headerName: LS.TAG_ACTIVO,
          headerClass: 'text-md-center',
          field: 'estado',
          width: 90,
          minWidth: 90,
          cellRendererFramework: InputEstadoComponent,
          cellClass: 'text-md-center'
        },
        {
          headerName: LS.TAG_OPCIONES,
          headerClass: 'cell-header-center',
          cellClass: 'text-center',
          // cellClass: (params) => { return (params.data.estadocontrato !=='L') ? 'd-none' : 'text-center' },
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
        }
      );
    } else {
      columnas.push(
        this.utilService.getSpanSelect()
      )
    }
    return columnas;
  }

  generarReglaPaFilasConMensajes() {
    return {
      "sick-days-breach": function(params) {
        let nmensajes = params.data.nmensajes;
        return nmensajes > 0;
      }
      // "sick-days-breach": "data.nmensajes > 0"
    };
  }
}
