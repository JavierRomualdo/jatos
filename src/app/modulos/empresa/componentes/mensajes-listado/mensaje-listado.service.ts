import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { UtilService } from 'src/app/servicios/util/util.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from 'src/app/contantes/app-constants';
import { InputEstadoComponent } from 'src/app/modulos/componentes/input-estado/input-estado.component';
import { BotonOpcionesComponent } from 'src/app/modulos/componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from 'src/app/modulos/componentes/tooltip-reader/tooltip-reader.component';
import { PinnedCellComponent } from 'src/app/modulos/componentes/pinned-cell/pinned-cell.component';

@Injectable({
  providedIn: 'root'
})
export class MensajeListadoService {

  constructor(
    private api: ApiRequest2Service,
    private utilService: UtilService,
    private toastr: ToastrService,
  ) { }

  listarMensajes(parametro, contexto) {
    this.api.post2('listarMensajes', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarMensajes(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarMensajes([]);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  ingresarMensaje(parametro, contexto) {
    this.api.post2('mensajes', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeIngresarMensaje(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  eliminarMensaje(parametro, contexto) {
    this.api.post2('eliminarMensaje', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeEliminarMensaje(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  cambiarEstadoMensaje(parametro, contexto) {
    this.api.post2('cambiarEstadoMensaje/', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesCambiarEstadoMensaje(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
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
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 38,
        minWidth: 38,
        maxWidth: 38,
      },
      {
        headerName: LS.TAG_NOMBRES,
        width: 100,
        minWidth: 100,
        valueGetter: (params) => {
          return params.data.nombres;
        }
      },
      {
        headerName: LS.TAG_TELEFONO,
        width: 100,
        minWidth: 100,
        valueGetter: (params) => {
          return params.data.telefono;
        }
      },
      {
        headerName: LS.TAG_EMAIL,
        width: 100,
        minWidth: 100,
        valueGetter: (params) => {
          return params.data.email;
        }
      },
      {
        headerName: LS.TAG_TITULO,
        width: 100,
        minWidth: 100,
        valueGetter: (params) => {
          return params.data.titulo;
        }
      },
      {
        headerName: LS.TAG_MENSAJE,
        width: 200,
        minWidth: 200,
        valueGetter: (params) => {
          return params.data.mensaje;
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
