import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from 'src/app/contantes/app-constants';
import { InputEstadoComponent } from 'src/app/modulos/componentes/input-estado/input-estado.component';
import { ImagenAccionComponent } from 'src/app/modulos/componentes/imagen-accion/imagen-accion.component';
import { UtilService } from 'src/app/servicios/util/util.service';
import { IconAccionComponent } from 'src/app/modulos/componentes/icon-accion/icon-accion.component';
import { BotonOpcionesComponent } from 'src/app/modulos/componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from 'src/app/modulos/componentes/tooltip-reader/tooltip-reader.component';
import { PinnedCellComponent } from 'src/app/modulos/componentes/pinned-cell/pinned-cell.component';
import { SpanMensajeComponent } from 'src/app/modulos/componentes/span-mensaje/span-mensaje.component';

@Injectable({
  providedIn: 'root'
})
export class CasasService {

  public constantes: any = LS;
  
  constructor(
    private api: ApiRequest2Service,
    private utilService: UtilService,
    private toastr: ToastrService,
  ) { }
  
  listarCasas(parametro, contexto) {
    this.api.post2('listarCasas', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarCasas(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarCasas([]);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  listarCasasParaTipoContrato(parametro, contexto) {
    this.api.post2('listarCasasParaTipoContrato', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarCasasParaTipoContrato(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarCasasParaTipoContrato([]);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  listarCasasPorEstadoContrato(parametro, contexto) {
    this.api.post2('listarCasasPorEstadoContrato', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarCasasPorEstadoContrato(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarCasasPorEstadoContrato([]);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  generarCodigoCasa(contexto) {
    this.api.get2('generarCodigoCasa').then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeGenerarCodigoCasa(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  ingresarCasa(parametro, contexto) {
    this.api.post2('casas', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeIngresarCasa(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  modificarCasa(parametro, contexto) {
    this.api.put2('casas/' + parametro.id, parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeModificarCasa(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  mostrarCasa(parametro, contexto) {
    this.api.get2('casas/' + parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeMostrarCasa(data.extraInfo);
        } else {
          this.toastr.warning('Error al mostrar ubigeo', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  cambiarEstadoCasa(parametro, contexto) {
    this.api.post2('cambiarEstadoCasa', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesCambiarEstadoCasa(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  eliminarCasa(parametro, contexto) {
    this.api.delete2('casas/'+parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeEliminarCasa(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  busquedaCasas(parametro, contexto) {
    this.api.post2('buscarcasa', parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeBusquedaCasas(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  // Mensajes
  cambiarEstadoMensajeCasa(parametro, contexto) {
    this.api.delete2('casamensaje/' + parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success('Se ha modificado el estado mensaje', 'Exito');
          contexto.despuesCambiarEstadoMensajeCasa(data);
        } else {
          this.toastr.warning('Error al modificar estado mensahe', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  listarMensajesCasa(parametro, contexto) {
    this.api.get2('mostrarcasamensajes/' + parametro.casa_id + '/' + parametro.valor).then(
      (res) => {
        if (res) {
          contexto.despuesDeListarMensajesCasa(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  eliminarFotoCasa(parametro, contexto) {
    this.api.delete2('casafoto/' + parametro.id).then(
      (res) => {
        const index = contexto.fotos.indexOf(parametro);
        contexto.fotos.splice(index, 1);
        contexto.despuesDeEliminarFotoCasa(res);
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
        width: 150,
        minWidth: 150,
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
        headerName: LS.TAG_PISOS,
        width: 80,
        minWidth: 80,
        valueGetter: (params) => {
          return params.data.npisos;
        }
      },
      {
        headerName: LS.TAG_CUARTOS,
        width: 90,
        minWidth: 90,
        valueGetter: (params) => {
          return params.data.ncuartos;
        }
      },
      {
        headerName: LS.TAG_BANIOS,
        width: 80,
        minWidth: 80,
        valueGetter: (params) => {
          return params.data.nbanios;
        }
      },
      {
        headerName: LS.TAG_JARDIN_PREG,
        width: 90,
        minWidth: 90,
        valueGetter: (params) => {
          return params.data.tjardin ? 'SI' : 'NO';
        }
      },
      {
        headerName: LS.TAG_COCHERA_PREG,
        width: 100,
        minWidth: 100,
        valueGetter: (params) => {
          return params.data.tcochera ? 'SI' : 'NO';
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