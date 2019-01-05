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
        headerName: LS.TAG_DESDE,
        width: 90,
        minWidth: 90,
        valueGetter: (params) => {
          return params.data.fechadesde;
        }
      },
      {
        headerName: LS.TAG_HASTA,
        width: 90,
        minWidth: 90,
        valueGetter: (params) => {
          return params.data.fechahasta;
        }
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',
        field: '',
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRenderer: "botonOpciones",
        cellClass: 'text-md-center',
        cellRendererParams: (params) => {
          if (params.data.id) {
            return {
              icono: LS.ICON_BUSCAR,
              tooltip: LS.ACCION_VER_ALQUILER,
              accion: LS.ACCION_CONSULTAR
            };
          } else {
            return {
              icono: null,
              tooltip: null,
              accion: null
            };
          }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: LS.ICON_OPCIONES,
          tooltip: LS.TAG_OPCIONES,
          text: ''
        }
      }
    );
    return columnas;
  }
}
