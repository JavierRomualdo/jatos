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
export class CocheraService {

  constructor(
    private api: ApiRequest2Service,
    private archivoService: ArchivoService,
    private utilService: UtilService,
    private toastr: ToastrService,
  ) { }

  listarCocheras(parametro, contexto) {
    this.api.post2('listarCocheras', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarCocheras(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarCocheras([]);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  listarCocherasParaTipoContrato(parametro, contexto) {
    this.api.post2('listarCocherasParaTipoContrato', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarCocherasParaTipoContrato(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarCocherasParaTipoContrato([]);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  listarCocherasPorEstadoContrato(parametro, contexto) {
    this.api.post2('listarCocherasPorEstadoContrato', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarCocherasPorEstadoContrato(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarCocherasPorEstadoContrato([]);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  generarCodigoCochera(contexto) {
    this.api.get2('generarCodigoCochera').then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeGenerarCodigoCochera(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  ingresarCochera(parametro, contexto) {
    this.api.post2('cocheras', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeIngresarCochera(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  modificarCochera(parametro, contexto) {
    this.api.put2('cocheras/' + parametro.id, parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeModificarCochera(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  cambiarEstadoCochera(parametro, contexto) {
    this.api.post2('cambiarEstadoCochera', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeCambiarEstadoCochera(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  mostrarCochera(parametro, contexto) {
    this.api.get2('cocheras/' + parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeMostrarCochera(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  listarMensajesCochera(parametro, contexto) {
    this.api.get2('mostrarcocheramensajes/' + parametro.cochera_id + '/' + parametro.valor).then(
      (res) => {
        if (res) {
          contexto.despuesDeListarMensajesCochera(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  eliminarCochera(parametro, contexto) {
    this.api.delete2('cocheras/'+parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeEliminarCochera(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  busquedaCocheras(parametro, contexto) {
    this.api.post2('buscarcochera', parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeBusquedaCocheras(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  cambiarEstadoMensajeCochera(parametro, contexto) {
    this.api.delete2('cocheramensaje/' + parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado el estado mensaje', 'Exito');
          contexto.despuesCambiarEstadoMensajeCochera(res);
        } else {
          this.toastr.warning('Error al modificar estado mensahe', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  eliminarFotoCochera(parametro, contexto) {
    this.api.delete2('cocherafoto/' + parametro.id).then(
      (res) => {
        const index = contexto.fotos.indexOf(parametro);
        contexto.fotos.splice(index, 1);
        contexto.despuesDeEliminarFotoCochera(res);
      },
      (error) => {
        console.log('error: ');
      }
    ).catch(err => this.handleError(err, contexto));
  }

  imprimirCocheras(parametro, contexto) {
    this.archivoService.postPdf("imprimirReporteCocheras", parametro).then(
      (data) => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('ListadoCocheras_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
    ).catch(err => this.utilService.handleError(err, this));
  }

  exportarExcelCocheras(parametro, contexto) {
    this.archivoService.postExcel("exportarExcelCocheras", parametro).then(
      (data) => {
        if (data) {
          this.utilService.descargarArchivoExcel(data, "ListadoCocheras_");
        } else {
          this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
    ).catch(err => this.utilService.handleError(err, this));
  }

  private handleError(error: any, contexto): void {
    contexto.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
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
        width: 120,
        minWidth: 120,
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
        headerName: LS.TAG_MENSAJES,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'nmensajes',
        width: 95,
        minWidth: 95,
        cellRendererFramework: SpanMensajeComponent,
        cellClass: 'text-md-center'
      },
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
