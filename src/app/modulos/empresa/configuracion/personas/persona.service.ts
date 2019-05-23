import { Injectable } from '@angular/core';
import { LS } from 'src/app/contantes/app-constants';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { InputEstadoComponent } from 'src/app/modulos/componentes/input-estado/input-estado.component';
import { BotonOpcionesComponent } from 'src/app/modulos/componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from 'src/app/modulos/componentes/tooltip-reader/tooltip-reader.component';
import { PinnedCellComponent } from 'src/app/modulos/componentes/pinned-cell/pinned-cell.component';
import { UtilService } from 'src/app/servicios/util/util.service';
import { ArchivoService } from 'src/app/servicios/archivo/archivo.service';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  public constantes: any = LS;

  constructor(
    private api: ApiRequest2Service,
    private archivoService: ArchivoService,
    private utilService: UtilService,
    private toastr: ToastrService, // para mensajes de exito o error
  ) { }

  listarPersonas(parametro, contexto) {
    this.api.post2('listarPersonas', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarPersonas(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarPersonas([]);
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  ingresarPersona(parametro, contexto) {
    this.api.post2('personas', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeIngresarPersona(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  modificarPersona(parametro, contexto) {
    this.api.put2('personas/' + parametro.id, parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeModificarPersona(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  cambiarEstadoPersona(parametro, contexto) {
    this.api.post2('cambiarEstadoPersona', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeCambiarEstadoPersona(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  eliminarPersona(parametro, contexto) {
    this.api.delete2('personas/'+parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeEliminarPersona(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  mostrarPersona(parametro, contexto) {
    this.api.get2('personas/' + parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeMostrarPersona(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  busquedaPersonas(parametro, contexto) {
    this.api.post2('buscarpersona', parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeBusquedaPersonas(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirPersonas(parametro, contexto) {
    this.archivoService.postPdf("imprimirReportePersonas", parametro).then(
      (data) => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('ListadoPersonas_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirPersonaDetalle(parametro, contexto) {
    this.archivoService.postPdf("imprimirReportePersonaDetalle", parametro).then(
      (data) => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('DetallePersona_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(isModal: boolean): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_NOMBRES,
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          return params.data.nombres;
        }
      },
      {
        headerName: LS.TAG_DNI,
        width: 100,
        minWidth: 100,
        valueGetter: (params) => {
          return params.data.dni;
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
        headerName: LS.TAG_TELEFONO,
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          return params.data.telefono;
        }
      },
      {
        headerName: LS.TAG_EMAIL,
        width: 160,
        minWidth: 160,
        valueGetter: (params) => {
          return params.data.correo;
        }
      },
      {
        headerName: LS.TAG_ROL,
        width: 100,
        minWidth: 100,
        valueGetter: (params) => {
          return params.data.rol;
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
