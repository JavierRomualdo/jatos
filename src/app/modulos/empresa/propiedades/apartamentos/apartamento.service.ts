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

@Injectable({
  providedIn: 'root'
})
export class ApartamentoService {

  constructor(
    private api: ApiRequest2Service,
    private toastr: ToastrService,
  ) { }

  listarApartamentos(parametro, contexto) {
    this.api.post2('listarApartamentos', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarApartamentos(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarApartamentos([]);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  listarApartamentosParaTipoContrato(parametro, contexto) {
    this.api.post2('listarApartamentosParaTipoContrato', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarApartamentosParaTipoContrato(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarApartamentosParaTipoContrato([]);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  listarApartamentosPorEstadoContrato(parametro, contexto) {
    this.api.post2('listarApartamentosPorEstadoContrato', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarApartamentosPorEstadoContrato(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarApartamentosPorEstadoContrato([]);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  generarCodigoApartamento(contexto) {
    this.api.get2('generarCodigoApartamento').then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeGenerarCodigoApartamento(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  ingresarApartamento(parametro, contexto) {
    this.api.post2('apartamentos', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeIngresarApartamento(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  modificarApartamento(parametro, contexto) {
    this.api.put2('apartamentos/' + parametro.id, parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeModificarApartamento(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  cambiarEstadoApartamento(parametro, contexto) {
    this.api.post2('cambiarEstadoApartamento', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeCambiarEstadoApartamento(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  mostrarApartamento(parametro, contexto) {
    this.api.get2('apartamentos/' + parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          contexto.despuesDeMostrarApartamento(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  listarMensajesApartamento(parametro, contexto) {
    this.api.get2('mostrarapartamentomensajes/' + parametro.apartamento_id + '/' + parametro.valor).then(
      (res) => {
        if (res) {
          contexto.despuesDeListarMensajesApartamento(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  eliminarApartamento(parametro, contexto) {
    this.api.delete2('apartamentos/'+parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeEliminarApartamento(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  busquedaApartamentos(parametro, contexto) {// ya no va
    this.api.post2('buscarapartamento', parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeBusquedaApartamentos(res);
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  cambiarEstadoMensajeApartamento(parametro, contexto) {
    this.api.delete2('apartamentomensaje/' + parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha modificado el estado mensaje', 'Exito');
          contexto.despuesCambiarEstadoMensajeApartamento(res);
        } else {
          this.toastr.warning('Error al modificar estado mensahe', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.handleError(err, contexto));
  }

  eliminarFotoApartamento(parametro, contexto) {
    this.api.delete2('apartamentofoto/' + parametro.id).then(
      (res) => {
        const index = contexto.fotos.indexOf(parametro);
        contexto.fotos.splice(index, 1);
        contexto.despuesDeEliminarFotoApartamento(res);
      },
      (error) => {
        console.log('error: ');
      }
    ).catch(err => this.handleError(err, contexto));
  }

  private handleError(error: any, contexto): void {
    contexto.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }

  generarColumnas(isModal: boolean): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
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
        width: 115,
        minWidth: 115,
        cellRendererFramework: IconAccionComponent,
        cellClass: 'text-md-center'
      },
      {
        headerName: LS.TAG_CODIGO,
        width: 100,
        minWidth: 100,
        valueGetter: (params) => {
          return params.data.codigo;
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
        width: 100,
        minWidth: 100,
        valueGetter: (params) => {
          return params.data.precioadquisicion;
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
        headerName: LS.TAG_COCHERA_PREG,
        width: 90,
        minWidth: 90,
        valueGetter: (params) => {
          return params.data.tcochera ? 'SI' : 'NO';
        }
      }
    );
    if (!isModal) {
      columnas.push(
        {
          headerName: LS.TAG_ACTIVO,
          headerClass: 'text-md-center',//Clase a nivel de th
          field: 'estado',
          width: 115,
          minWidth: 115,
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
    }
    return columnas;
  }
}
