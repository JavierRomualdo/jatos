import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';

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
}
