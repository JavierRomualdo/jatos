import { Injectable } from '@angular/core';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from 'src/app/servicios/util/util.service';
import { LS } from 'src/app/contantes/app-constants';
import { InputEstadoComponent } from 'src/app/modulos/componentes/input-estado/input-estado.component';
import { BotonOpcionesComponent } from 'src/app/modulos/componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from 'src/app/modulos/componentes/tooltip-reader/tooltip-reader.component';
import { PinnedCellComponent } from 'src/app/modulos/componentes/pinned-cell/pinned-cell.component';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {

  constructor(
    private api: ApiRequest2Service,
    private utilService: UtilService,
    private toastr: ToastrService,
  ) { }

  litarUbigeos(contexto) {
    this.api.get2('ubigeos').then(
      (res) => {
        if (res.length>0) {
          contexto.despuesDeListarUbigeos(res);
        } else {
          this.toastr.warning('No se encontraron resultados', LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  ingresarUbigeo(parametro, contexto) {
    this.api.post2('ubigeos', parametro).then(
      (res) => {
        if (res) {
          this.toastr.success('Se ha ingresado correctamente', LS.TAG_EXITO);
          contexto.despuesDeIngresarUbigeo(res);
        } else {
          this.toastr.warning('Error al ingresar ubigeo', LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  modificarUbigeo(parametro, contexto) {
    this.api.put2('ubigeos/' + parametro.ubigeo.id, parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeModificarUbigeo(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  cambiarEstadoUbigeo(parametro, contexto) {
    this.api.post2('cambiarEstadoUbigeo', parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeCambiarEstadoUbigeo(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  eliminarUbigeo(parametro, contexto) {
    this.api.delete2('servicios/'+parametro).then(
      (data) => {
        if (data && data.extraInfo) {
          this.toastr.success(data.operacionMensaje, LS.TAG_EXITO);
          contexto.despuesDeEliminarUbigeo(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  mostrarUbigeo(parametro, contexto) {
    this.api.get2('ubigeos/' + parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeMostrarUbigeo(res);
        } else {
          this.toastr.warning('Error al mostrar ubigeo', LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  mostrarUbigeos(parametro, contexto) {
    this.api.get2('mostrarubigeos/' + parametro.idtipoubigeo + '/' + parametro.codigo).then(
      (res) => {
        if (res) {
          if (parametro.idtipoubigeo === 1) { // departamento
            // listo las provincias del departamento
            contexto.despuesDeMostrarUbigeosProvincias(res);
          } else if (parametro.idtipoubigeo === 2) { // provincia
            // listo los distritos de la provincia
            contexto.despuesDeMostrarUbigeosDistritos(res);
          } else if (parametro.idtipoubigeo === 3) { // distrito
            contexto.despuesDeMostrarUbigeosHabilitacionUrbanas(res);
          }
        } else {
          this.toastr.warning('No se encontraron resultados', 'Aviso');
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  listarubigeos(parametro, contexto) {
    this.api.post2('listarubigeos', parametro).then(
      (data) => {
        if (data) {
          if (parametro.tipoubigeo_id === 0) {
            contexto.despuesDeMostrarUbigeosDepartamentos(data.extraInfo);
          } else if (parametro.tipoubigeo_id === 1) { // departamento
            // listo las provincias del departamento
            contexto.despuesDeMostrarUbigeosProvincias(data.extraInfo);
          } else if (parametro.tipoubigeo_id === 2) { // provincia
            // listo los distritos de la provincia
            contexto.despuesDeMostrarUbigeosDistritos(data.extraInfo);
          } else if (parametro.tipoubigeo_id === 3) { // distrito
            contexto.despuesDeMostrarUbigeosHabilitacionUrbanas(data.extraInfo);
          }
          !data.extraInfo && this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  busquedaUbigeos(parametro, contexto) {
    this.api.post2('buscarubigeos', parametro).then(
      (res) => {
        if (res) {
          contexto.despuesDeBusquedaUbigeos(res);
        } else {
          this.toastr.warning('No se encontraron resultados', LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  // para el welcome
  buscarUbigeosHabilitacionUrbana(parametro, contexto) {
    this.api.get2('buscarUbigeosHabilitacionUrbana/'+parametro).then(
      (res) => {
        contexto.despuesDeBuscarUbigeosHabilitacionUrbana(res);
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }
  //

  buscarUbigeosDistrito(parametro, contexto) {
    this.api.get2('buscarUbigeosDistrito/'+parametro).then(
      (res) => {
        contexto.despuesDeBuscarUbigeosDistrito(res);
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  searchUbigeo(parametro, contexto) {
    this.api.get2('searchUbigeo/'+parametro).then(
      (res) => {
        contexto.despuesDeSearchUbigeo(res);
      }
    ).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(isModal: boolean): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_UBIGEO,
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          return params.data.ubigeo;
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
      }
    );
    // if (isModal) {
    //   columnas.push(
    //     this.utilService.getSpanSelect()
    //   )
    // }
    return columnas;
  }
}
