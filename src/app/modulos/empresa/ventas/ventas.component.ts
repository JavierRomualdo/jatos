import { Component, OnInit, Input, HostListener, ViewChild } from '@angular/core';
import { LS } from 'src/app/contantes/app-constants';
import { UbigeoService } from '../configuracion/ubigeo/modal-ubigeo/ubigeo.service';
import { NgForm } from '@angular/forms';
import { VentaServiceService } from './venta-service.service';
import { VentaTO } from 'src/app/entidadesTO/empresa/VentaTO';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { UbigeoTO } from 'src/app/entidadesTO/empresa/UbigeoTO';
import { BotonAccionComponent } from '../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../componentes/tooltip-reader/tooltip-reader.component';
import { UtilService } from 'src/app/servicios/util/util.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {

  @Input() isModal: boolean;
  constantes: any = LS;
  activar: boolean = false;
  public cargando: boolean = false;
  public listaPropiedades: Array<string> = [];
  public propiedadSeleccionado: string = "";
  public listaDepartamentos: UbigeoTO[] = [];
  public departamentoSeleccionado: UbigeoTO;
  public listaProvincias: UbigeoTO[] = [];
  public provinciaSeleccionado: UbigeoTO;
  public listaDistritos: UbigeoTO[] = [];
  public distritoSeleccionado: UbigeoTO;
  public ubigeoSeleccionado: UbigeoTO;

  public parametrosListado: any;
  public parametrosFormulario: any
  //
  public listaResultado: Array<VentaTO> = [];
  public ventaSeleccionado: VentaTO;
  public isScreamMd: boolean = true;
  //
  public vistaFormulario: boolean = false;

  public filtroGlobal: string = "";
  public enterKey: number = 0;//Suma el numero de enter

  public parametrosFoto: any = null;
  public frameworkComponents;

  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public localeText = {};
  public context;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  
  constructor(
    private ubigeoService: UbigeoService,
    private utilService: UtilService,
    private ventaService: VentaServiceService
  ) { }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.localeText = { noRowsToShow: 'No se encontraron ventas', page: "Página", of: "de", to: "a" };
    this.listaPropiedades = LS.LISTA_PROPIEDADES_VENTA;
    this.propiedadSeleccionado = this.listaPropiedades ? this.listaPropiedades[0] : null;
    this.departamentoSeleccionado = undefined;
    this.provinciaSeleccionado = undefined;
    this.distritoSeleccionado = undefined
    //
    this.mostrarDepartamentos();
    this.iniciarAgGrid();
  }

  cambiarPropiedadSeleccionado() {

  }

  mostrarDepartamentos() {
    this.cargando = true;
    this.ubigeoService.litarUbigeos(this);
  }

  despuesDeListarUbigeos(data) { // despues de listar departamentos
    this.listaDepartamentos = data;
    // this.ubigeos = data;
    this.cargando = false;
    console.log(data);
  }

  mostrarprovincias(departamentoSeleccionado) {
    this.limpiarResultado();
    this.ubigeoSeleccionado = departamentoSeleccionado; //
    console.log(departamentoSeleccionado);
    this.mostrarubigeos(departamentoSeleccionado.tipoubigeo_id, departamentoSeleccionado.codigo);
  }

  despuesDeMostrarUbigeosProvincias(data) {
    this.cargando = false;
    this.listaProvincias = data;
    // this.ubigeos = this.ubigeoprovincias;
  }

  seleccionarDistrito(distritoSeleccionado) {
    this.limpiarResultado();
    this.ubigeoSeleccionado = distritoSeleccionado; //
  }

  mostrardistritos(provinciaSeleccionado) {
    this.limpiarResultado();
    this.ubigeoSeleccionado = provinciaSeleccionado; //
    console.log(provinciaSeleccionado);
    this.mostrarubigeos(provinciaSeleccionado.tipoubigeo_id, provinciaSeleccionado.codigo);
  }

  despuesDeMostrarUbigeosDistritos(data) {
    this.cargando = false;
    this.listaDistritos = data;
  }

  mostrarubigeos(idtipoubigeo, codigo) {
    this.cargando = true;
    let parametros = {idtipoubigeo: idtipoubigeo, codigo: codigo};
    this.ubigeoService.mostrarUbigeos(parametros, this);
  }

  limpiarResultado() {
    this.listaResultado = [];
  }

  listarVentas(parametro, form: NgForm) {
    if (form && form.valid) {
      this.cargando = true;
      let parametros = {
        propiedad: this.propiedadSeleccionado,
        ubigeo: this.ubigeoSeleccionado,
        parametro: parametro // esto ya no va
      };
      this.ventaService.listarVentas(parametros, this);
    }
  }

  despuesDeListarVentas(data) {
    this.cargando = false;
    this.listaResultado = data;
  }

  nuevaVenta(form: NgForm) {
    if (form && form.valid) {
      this.parametrosFormulario = {
        accion: LS.ACCION_NUEVO,
        propiedad: this.propiedadSeleccionado,
        ubigeo: this.ubigeoSeleccionado,
      }
      this.vistaFormulario = true;
    }
  }

  consultar() {
    this.parametrosFormulario = {
      accion: LS.ACCION_CONSULTAR,
      propiedad: this.propiedadSeleccionado,
      ubigeo: this.ubigeoSeleccionado,
      ventaSeleccionado: this.ventaSeleccionado
    }
    this.vistaFormulario = true;
  }

  // modal de mostrar imagen
  mostrarModalImagen(data) {
    this.parametrosFoto = {
      display: true,
      foto: data.foto
    }
  }

  onDialogClose(event) {
    this.parametrosFoto = null;
  } //

  ejecutarAccion(data) {
    this.vistaFormulario = false;
    this.parametrosFormulario = null;
    this.refrescarTabla(data.accion, data.ventaTO);
  }

  // del boton: ver venta
  ejecutarConsultar(data) {
    this.consultar();
  }

  imprimirVentas() {
    this.cargando = true;
    let parametros = {
      fechaActual: this.utilService.obtenerFechaActual(),
      propiedad: this.propiedadSeleccionado,
      data: this.listaResultado
    }
    this.ventaService.imprimirVentas(parametros, this);
  }

  imprimirDetalleVenta() {
    this.cargando = true;
    let parametros = {
      venta: this.ventaSeleccionado,
      propiedad: this.propiedadSeleccionado,
      fechaActual: this.utilService.obtenerFechaActual()
    }
    this.ventaService.imprimirDetalleVenta(parametros, this);
  }

  exportarVentas() {
    this.cargando = true;
    let parametros = {
      fechaActual: this.utilService.obtenerFechaActual(),
      propiedad: this.propiedadSeleccionado,
      data: this.listaResultado
    }
    this.ventaService.exportarExcelVentas(parametros, this);
  }

  refrescarTabla(accion: string, ventaTO: VentaTO) {
    switch(accion) {
      case LS.ACCION_NUEVO: { // Insertar un elemento en la tabla
        let listaTemporal = [... this.listaResultado];
        listaTemporal.unshift(ventaTO);
        this.listaResultado = listaTemporal;
        // this.seleccionarFila(0);
        break;
      }
      case LS.ACCION_EDITAR: { // Actualiza un elemento en la tabla
        var indexTemp = this.listaResultado.findIndex(item => item.id === ventaTO.id);
        let listaTemporal = [... this.listaResultado];
        listaTemporal[indexTemp] = ventaTO;
        this.listaResultado = listaTemporal;
        this.ventaSeleccionado = this.listaResultado[indexTemp];
        // this.seleccionarFila(indexTemp);
        break;
      }
      case LS.ACCION_ELIMINAR: { // Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listaResultado.findIndex(item => item.id === ventaTO.id);
        let listaTemporal = [...this.listaResultado];
        listaTemporal.splice(indexTemp, 1);
        this.listaResultado = listaTemporal;
        // (this.listaResultado.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  generarOpciones() {
    let perImprimir = true;
    this.opciones = [
      { label: LS.ACCION_VER_VENTA, icon: LS.ICON_BUSCAR, disabled: false, command: () => this.consultar() },
      {separator:true},
      {
        label: LS.ACCION_IMPRIMIR,
        icon: LS.ICON_IMPRIMIR,
        disabled: !perImprimir,
        command: () => perImprimir ? this.imprimirDetalleVenta() : null
      }
    ];
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.ventaService.generarColumnas(this.isModal);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent
    };
    this.context = { componentParent: this };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.redimensionarColumnas();
  }

  mostrarOpciones(event, dataSelected) { // BOTON OPCIONES
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.ventaSeleccionado = data;
    if (!this.isModal) {
      this.generarOpciones();
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.ventaSeleccionado = fila ? fila.data : null;
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    // setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  // actualizarFilas() {
  //   this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
  //   this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  // }
  //#endregion
  
  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
  }

}
