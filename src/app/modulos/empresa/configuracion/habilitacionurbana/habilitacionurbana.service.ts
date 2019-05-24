import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { UtilService } from 'src/app/servicios/util/util.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from 'src/app/contantes/app-constants';
import { InputEstadoComponent } from 'src/app/modulos/componentes/input-estado/input-estado.component';
import { BotonOpcionesComponent } from 'src/app/modulos/componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from 'src/app/modulos/componentes/tooltip-reader/tooltip-reader.component';
import { PinnedCellComponent } from 'src/app/modulos/componentes/pinned-cell/pinned-cell.component';
import { ArchivoService } from 'src/app/servicios/archivo/archivo.service';

@Injectable({
  providedIn: 'root'
})
export class HabilitacionurbanaService {

  constructor(
    private api: ApiRequest2Service,
    private archivoService: ArchivoService,
    private utilService: UtilService,
    private toastr: ToastrService
  ) { }

  listarHabilitacionUrbana(parametro, contexto) {
    this.api.post2('listarHabilitacionUrbana', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarHabilitacionUrbana(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarHabilitacionUrbana([]);
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  ingresarHabilitacionUrbana(parametro, contexto) {
    this.api.post2('habilitacionurbana', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeIngresarHabilitacionUrbana(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  modificarHabilitacionUrbana(parametro, contexto) {
    this.api.put2('habilitacionurbana/' + parametro.id, parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeModificarHabilitacionUrbana(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  cambiarEstadoHabilitacionUrbana(parametro, contexto) {
    this.api.post2('cambiarEstadoHabilitacionUrbana', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeCambiarEstadoHabilitacionUrbana(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  eliminarHabilitacionUrbana(parametro, contexto) {
    this.api.delete2('habilitacionurbana/'+parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeEliminarHabilitacionUrbana(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  mostrarHabilitacionUrbana(parametro, contexto) {
    this.api.get2('habilitacionurbana/' + parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeMostrarHabilitacionUrbana(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirHabilitacionesUrbanas(parametro, contexto) {
    this.archivoService.postPdf("imprimirReporteHabilitacionesUrbanas", parametro).then(
      (data) => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('ListadoHabilitacionesUrbanas_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirHabilitacionUrbanaDetalle(parametro, contexto) {
    this.archivoService.postPdf("imprimirReporteHabilitacionUrbanaDetalle", parametro).then(
      (data) => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('DetalleHabilitacionUrbana_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  exportarExcelHabilitacionesUrbanas(parametro, contexto) {
    this.archivoService.postExcel("exportarExcelHabilitacionesUrbanas", parametro).then(
      (data) => {
        if (data) {
          this.utilService.descargarArchivoExcel(data, "ListadoHabilitacionesUrbanas_");
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
        headerName: LS.TAG_NOMBRE,
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          return params.data.nombre;
        }
      },
      {
        headerName: LS.TAG_SIGLAS,
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          return params.data.siglas;
        }
      },
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
        cellClass: 'text-center',
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

    );
    if (isModal) {
      columnas.push(
        this.utilService.getSpanSelect()
      )
    }
    return columnas;
  }
}
