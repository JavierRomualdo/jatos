import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from 'src/app/contantes/app-constants';
import { IconAccionComponent } from '../../componentes/icon-accion/icon-accion.component';
import { ImagenAccionComponent } from '../../componentes/imagen-accion/imagen-accion.component';
import { ArchivoService } from 'src/app/servicios/archivo/archivo.service';
import { UtilService } from 'src/app/servicios/util/util.service';

@Injectable({
  providedIn: 'root'
})
export class VentaServiceService {

  constructor(
    private api: ApiRequest2Service,
    private archivoService: ArchivoService,
    private utilService: UtilService,
    private toastr: ToastrService,
  ) { }

  listarVentas(parametro, contexto) {
    this.api.post2('listarVentas', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarVentas(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarVentas([]);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  mostrarVenta(parametro, contexto) {
    this.api.get2('ventas/'+parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeMostrarVenta(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  ingresarVenta(parametro, contexto) {
    this.api.post2('ventas', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeIngresarVenta(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  imprimirVentas(parametro, contexto) {
    this.archivoService.postPdf("imprimirReporteVentas", parametro).then(
      (data) => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('ListadoVentas_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
    ).catch(err => this.utilService.handleError(err, this));
  }

  imprimirDetalleVenta(parametro, contexto) {
    this.archivoService.postPdf("imprimirReporteVentaDetalle", parametro).then(
      (data) => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('DetalleVenta_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
    ).catch(err => this.utilService.handleError(err, this));
  }

  exportarExcelVentas(parametro, contexto) {
    this.archivoService.postExcel("exportarExcelVentas", parametro).then(
      (data) => {
        if (data) {
          this.utilService.descargarArchivoExcel(data, "ListadoVentas_");
        } else {
          this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
    ).catch(err => this.utilService.handleError(err, this));
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
        width: 110,
        minWidth: 110,
        valueGetter: (params) => {
          return params.data.preciocontrato;
        }
      },
      {
        headerName: LS.TAG_FECHA_VENTA,
        width: 90,
        minWidth: 90,
        valueGetter: (params) => {
          return params.data.fechaVenta;
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
              tooltip: LS.ACCION_VER_VENTA,
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
