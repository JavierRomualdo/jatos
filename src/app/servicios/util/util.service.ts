import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import swal, { SweetAlertOptions } from 'sweetalert2';
import * as moment from 'moment';
import { LS } from 'src/app/contantes/app-constants';
import { BotonOpcionesComponent } from 'src/app/modulos/componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from 'src/app/modulos/componentes/tooltip-reader/tooltip-reader.component';
import { PinnedCellComponent } from 'src/app/modulos/componentes/pinned-cell/pinned-cell.component';
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

  generarItemsMenuesPropiedades(contexto) {
    let items = [
        {
            label: 'Archivo',
            icon: 'pi pi-fw pi-file',
            items: [{
                    label: 'Nuevo', 
                    icon: 'pi pi-fw pi-plus',
                    command: () => {
                      contexto.nuevo();
                    }
                }
            ]
        },
        {
            label: 'Consultar',
            icon: 'pi pi-fw pi-cog',
            items: [
                {
                    label: 'General', 
                    icon: 'pi pi-fw pi-search', 
                    items: [
                      {
                        label: 'Todo', 
                        icon: 'pi pi-fw pi-search',
                        command: () => {
                          contexto.consultarGeneral(true);
                        }
                      },
                      {
                        label: 'Inactivos', 
                        icon: 'pi pi-fw pi-search',
                        command: () => {
                          contexto.consultarGeneral(false);
                        }
                      }
                    ]
                },
                {separator:true},
                {
                  label: 'Contrato', 
                  icon: 'pi pi-fw pi-search',
                  items: [
                    {
                      label: 'Vendidas', 
                      icon: 'pi pi-fw pi-search',
                      command: () => {
                        contexto.consultarContrato('V');
                      }
                    },
                    {
                      label: 'Alquiladas', 
                      icon: 'pi pi-fw pi-search',
                      command: () => {
                        contexto.consultarContrato('A');
                      }
                    }
                  ]
                },
                {separator:true},
                {
                  label: 'Post - contrato',
                  icon: 'pi pi-fw pi-search',
                  items: [
                    {
                      label: 'Libres', 
                      icon: 'pi pi-fw pi-search',
                      command: () => {
                        contexto.consultarPostContrato('L');
                      }
                    },
                    {
                      label: 'Reservadas', 
                      icon: 'pi pi-fw pi-search',
                      command: () => {
                        contexto.consultarPostContrato('R');
                      }
                    }
                  ]
                }
            ]
        }
    ];
    return items;
  }
}
