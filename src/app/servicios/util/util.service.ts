import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import swal, { SweetAlertOptions } from 'sweetalert2';
import * as moment from 'moment';
import { LS } from 'src/app/contantes/app-constants';
import { BotonOpcionesComponent } from 'src/app/modulos/componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from 'src/app/modulos/componentes/tooltip-reader/tooltip-reader.component';
import { PinnedCellComponent } from 'src/app/modulos/componentes/pinned-cell/pinned-cell.component';
import { SpanAccionComponent } from 'src/app/modulos/componentes/span-accion/span-accion.component';
@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() {
    moment.locale('es');
  }

  /**
   * Recibe un string fecha en un formato dado y retorna un Date 
   * @param fecha : string {1999-11-11}
   * @param formato : string {DD/MM/AAAA}
   * Buscar más ejemplos en: https://momentjs.com/docs/
   */
  fomatearFechaString(fecha, formato): Date {
    return moment(fecha, formato).toDate();
  }

  formatearDateToStringYYYYMMDD(fecha: Date) {
    return fecha ? fecha.toISOString().slice(0, 10) : null;
  }

  formatearDateToStringDDMMYYYY(fecha: Date) {
    let fechaString = fecha.toISOString().slice(0, 10).split('-');
    return fechaString[2] + '-' + fechaString[1] + '-' + fechaString[0];
  }

  obtenerHorayFechaActual() { //DE LA PC DE USUARIO
    return moment().format('hh_mm_ss DD-MM-YYYY');
  }

  obtenerFechaActual() { // DE LA PC DE USUARIO
    return moment().format('YYYY-MM-DD'); // DD-MM-YYYY
  }

  obtenerFechaActualYTiempo() { // DE LA PC DE USUARIO
    return moment().format('YYYY-MM-DD H:MM:SS');
  }

  setLocaleDate(): any {
    return {
      firstDayOfWeek: 0,
      dayNames: [LS.TAG_DOMINGO, LS.TAG_LUNES, LS.TAG_MARTES, LS.TAG_MIERCOLES, LS.TAG_JUEVES, LS.TAG_VIERNES, LS.TAG_SABADO],
      dayNamesShort: [LS.TAG_DOM, LS.TAG_LUN, LS.TAG_MAR, LS.TAG_MIE, LS.TAG_JUE, LS.TAG_VIE, LS.TAG_SAB],
      dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Jue", "Vi", "Sa"],
      monthNames: ["Enero ", "Febrero ", "Marzo ", "Abril ", "Mayo ", "Junio ", "Julio ", "Agosto ", "Septiembre ", "Octubre ", "Noviembre ", "Diciembre "],
      monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      today: 'Hoy',
      clear: 'Limpiar'
    };
  }

  establecerFormularioTocado(form: NgForm): boolean {
    let touched = true;
    let formControls = form.form.controls;
    for (let element in formControls) {
      form.controls[element].markAsTouched();
      form.controls[element].updateValueAndValidity();
    }
    return touched;
  }

  generarSwallConfirmacionHtml(parametros) {
    return swal({
      title: parametros.title,
      html: parametros.texto,
      type: parametros.type,
      showCancelButton: true,
      confirmButtonColor: parametros.confirmButtonColor ? parametros.confirmButtonColor : '#416273',
      cancelButtonColor: '#aeb3b7',
      confirmButtonText: parametros.confirmButtonText,
      cancelButtonText: parametros.cancelButtonText,
      allowEnterKey: true,
      allowEscapeKey: true,
    }).then((result) => {
      if (result.value) {
        return true;
      } else {
        return false;
      }
    });
  }

  public getColumnaOpciones(): any {
    return {
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
    }
  }

  public getSpanSelect(tamanio?): any {
    return {
      headerName: LS.TAG_SELECCIONE,
      headerClass: 'cell-header-center',//Clase a nivel de th
      cellClass: (params) => {
        if (tamanio) {
          if (params.data.cuentaCodigo && params.data.cuentaCodigo.length === tamanio) {
            return 'text-center';
          } else { return 'ag-hidden'; }
        } else {
          return 'text-center';
        }
      },
      width: 70,
      minWidth: 70,
      maxWidth: 70,
      cellRendererFramework: SpanAccionComponent,
      cellRendererParams: (params) => {
        return {
          icono: LS.ICON_SELECCIONAR,
          tooltip: LS.ACCION_SELECCIONAR,
          accion: LS.ACCION_SELECCIONAR,
        }
      },
      headerComponentFramework: TooltipReaderComponent,
      headerComponentParams: {
        class: LS.ICON_SELECCIONAR,
        tooltip: LS.TAG_SELECCIONE,
        text: '',
        enableSorting: false
      },
    }
  }

  generarItemsMenuesNotificaciones(contexto) {
    let items = [
      {
            label: LS.ACCION_CONSULTAR,
            icon: LS.ICON_CONSULTAR,
            items: [
                {
                    label: LS.TAG_GENERAL, 
                    icon: LS.ICON_BUSCAR_MAS,
                    items: [
                      {
                        label: LS.TAG_ACTIVOS, 
                        icon: LS.ICON_ACTIVO,
                        command: () => {
                          contexto.consultarNotificaciones(true);
                        }
                      },
                      {
                        label: LS.TAG_INCLUIR_INACTIVOS, 
                        icon: LS.ICON_INACTIVO,
                        command: () => {
                          contexto.consultarNotificaciones(false);
                        }
                      }
                    ]
                }
            ]
        }
    ];
    return items;
  }

  generarItemsMenuesPropiedades(contexto, vermensajes: boolean, contrato: string) {
    let items = [
        {
            label: LS.TAG_ARCHIVO,
            icon: LS.ICON_ARCHIVO,
            disabled: !vermensajes,
            items: [{
                    label: LS.ACCION_NUEVO, 
                    icon: LS.ICON_NUEVO,
                    command: () => {
                      contexto.nuevo();
                    }
                }
            ]
        },
        {
            label: LS.ACCION_CONSULTAR,
            icon: LS.ICON_CONSULTAR,
            disabled: !vermensajes,
            items: [
                {
                    label: LS.TAG_GENERAL, 
                    icon: LS.ICON_BUSCAR_MAS,
                    items: [
                      {
                        label: LS.TAG_ACTIVOS, 
                        icon: LS.ICON_ACTIVO,
                        command: () => {
                          contexto.consultarGeneral(true);
                        }
                      },
                      {
                        label: LS.TAG_INCLUIR_INACTIVOS, 
                        icon: LS.ICON_INACTIVO,
                        command: () => {
                          contexto.consultarGeneral(false);
                        }
                      }
                    ]
                },
                {separator:true},
                {
                  label: LS.TAG_CONTRATO, 
                  icon: LS.ICON_BUSCAR_MAS,
                  items: this.agregarMenuPorContrato(contexto, contrato)
                },
                {separator:true},
                {
                  label: LS.TAG_PRE_CONTRATO,
                  icon: LS.ICON_BUSCAR_MAS,
                  items: [
                    {
                      label: LS.TAG_LIBRES, 
                      icon: LS.ICON_LIBRE,
                      command: () => {
                        contexto.consultarEstadoContrato('L');
                      }
                    },
                    {
                      label: LS.TAG_RESERVADAS, 
                      icon: LS.ICON_RESERVADO,
                      command: () => {
                        contexto.consultarEstadoContrato('R');
                      }
                    }
                  ]
                }
            ]
        }
    ];
    return items;
  }

  agregarMenuPorContrato(contexto, contrato: string) {
    let columnas = [];
    if (contrato==='V') { // V y A
      columnas.push({
        label: LS.TAG_VENDIDAS, 
        icon: LS.ICON_VENTA,
        command: () => {
          contexto.consultarEstadoContrato('V');
        }
      },
      {
        label: LS.TAG_ALQUILADAS, 
        icon: LS.ICON_ALQUILER,
        command: () => {
          contexto.consultarEstadoContrato('A');
        }
      });
    } else if (contrato==='A') {
      columnas.push(
      {
        label: LS.TAG_ALQUILADAS, 
        icon: LS.ICON_ALQUILER,
        command: () => {
          contexto.consultarEstadoContrato('A');
        }
      });
    }
    return columnas;
  }
}
