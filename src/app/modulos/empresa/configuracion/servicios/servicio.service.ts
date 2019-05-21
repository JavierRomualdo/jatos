import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from 'src/app/contantes/app-constants';
import { InputEstadoComponent } from 'src/app/modulos/componentes/input-estado/input-estado.component';
import { BotonOpcionesComponent } from 'src/app/modulos/componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from 'src/app/modulos/componentes/tooltip-reader/tooltip-reader.component';
import { PinnedCellComponent } from 'src/app/modulos/componentes/pinned-cell/pinned-cell.component';
import { UtilService } from 'src/app/servicios/util/util.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  constructor(
    private api: ApiRequest2Service,
    private utilService: UtilService,
    private toastr: ToastrService
  ) { }

  listarServicios(parametro, contexto) {
    this.api.post2('listarServicios', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarServicios(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarServicios([]);
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  ingresarServicio(parametro, contexto) {
    this.api.post2('servicios', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeIngresarServicio(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  modificarServicio(parametro, contexto) {
    this.api.put2('servicios/' + parametro.id, parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeModificarServicio(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  cambiarEstadoServicio(parametro, contexto) {
    this.api.post2('cambiarEstadoServicio', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeCambiarEstadoServicio(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  eliminarServicio(parametro, contexto) {
    this.api.delete2('servicios/'+parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeEliminarServicio(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  mostrarServicio(parametro, contexto) {
    this.api.get2('servicios/' + parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeMostrarServicio(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  busquedaServicios(parametro, contexto) {
    this.api.post2('buscarservicio', parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeBusquedaServicios(res);
        } else {
          this.toastr.warning('No se encontraron resultados', LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(isModal: boolean): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_SERVICIO,
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          return params.data.servicio;
        }
      },
      {
        headerName: LS.TAG_DETALLE,
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          return params.data.detalle;
        }
      },
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
