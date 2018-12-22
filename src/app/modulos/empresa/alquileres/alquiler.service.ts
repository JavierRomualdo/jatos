import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from 'src/app/contantes/app-constants';
import { IconAccionComponent } from '../../componentes/icon-accion/icon-accion.component';
import { ImagenAccionComponent } from '../../componentes/imagen-accion/imagen-accion.component';
import { BotonOpcionesComponent } from '../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../componentes/tooltip-reader/tooltip-reader.component';
import { PinnedCellComponent } from '../../componentes/pinned-cell/pinned-cell.component';

@Injectable({
  providedIn: 'root'
})
export class AlquilerService {

  constructor(
    private api: ApiRequest2Service,
    private toastr: ToastrService,
  ) { }

  listarAlquileres(parametro, contexto) {
    this.api.post2('listarAlquileres', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarAlquileres(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarAlquileres([]);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  mostrarAlquiler(parametro, contexto) {
    this.api.get2('alquileres/'+parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeMostrarAlquiler(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  ingresarAlquiler(parametro, contexto) {
    this.api.post2('alquileres', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeIngresarAlquiler(data.extraInfo);
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
        headerName: 'Contrato',
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'estadocontrato',
        width: 115,
        minWidth: 115,
        cellRendererFramework: IconAccionComponent,
        cellClass: 'text-md-center'
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
        headerName: LS.TAG_CODIGO,
        width: 100,
        minWidth: 100,
        valueGetter: (params) => {
          return params.data.propiedad_codigo;
        }
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
        headerName: LS.TAG_CLIENTE,
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          return params.data.cliente;
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
        headerName: LS.TAG_PRECIO_CONTRATO,
        width: 100,
        minWidth: 100,
        valueGetter: (params) => {
          return params.data.preciocontrato;
        }
      },
      {
        headerName: LS.TAG_FECHA_ALQUILER,
        width: 80,
        minWidth: 80,
        valueGetter: (params) => {
          return params.data.fechaAlquiler;
        }
      },
      {
        headerName: LS.TAG_FECHA_CONTRATO,
        width: 80,
        minWidth: 80,
        valueGetter: (params) => {
          return params.data.fechacontrato;
        }
      }
    );
    if (!isModal) {
      columnas.push(
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
    }
    return columnas;
  }
}
