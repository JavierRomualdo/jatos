import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from 'events';
import { LS } from 'src/app/contantes/app-constants';
import { VentaServiceService } from '../../ventas/venta-service.service';
import * as moment from 'moment';
import { UtilService } from 'src/app/servicios/util/util.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Venta } from 'src/app/entidades/entidad.venta';

@Component({
  selector: 'app-venta-formulario',
  templateUrl: './venta-formulario.component.html',
  styleUrls: ['./venta-formulario.component.css']
})
export class VentaFormularioComponent implements OnInit {
  
  @Input() parametrosFormulario: any;
  @Output() enviarAccion = new EventEmitter();

  public constantes: any = LS;
  accion: string = null;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public cargando: boolean = false;
  public activar: boolean = false;
  public es: any = {}; //Locale Date (Obligatoria)
  public venta: Venta = new Venta();

  constructor(
    private ventaService: VentaServiceService,
    private utilService: UtilService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.es = this.utilService.setLocaleDate();
    moment.locale('es'); // para la fecha
  }

  insertarVenta(form: NgForm) {
    if (form && form.valid) {
      // this.setearValoresRhBonoMotivo();
      this.ventaService.ingresarVenta(this.venta, this);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }
}
