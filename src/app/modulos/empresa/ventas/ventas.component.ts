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
  //
  public listaResultado: Array<VentaTO> = [];
  public ventaSeleccionado: VentaTO;
  public isScreamMd: boolean = true;
  //
  public vistaFormulario: boolean = false;

  public filtroGlobal: string = "";
  public enterKey: number = 0;//Suma el numero de enter
  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public context;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  
  constructor(
    private ubigeoService: UbigeoService,
    private ventaService: VentaServiceService
  ) { }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;

    this.listaPropiedades = LS.LISTA_PROPIEDADES;
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
    this.ubigeoSeleccionado = distritoSeleccionado; //
  }

  mostrardistritos(provinciaSeleccionado) {
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

  limpiarResultado() { }

  listarVentas(parametro, form: NgForm) {
    if (form && form.valid) {
      this.parametrosListado = {
        propiedad: this.propiedadSeleccionado,
        ubigeo: this.ubigeoSeleccionado,
        parametro: parametro
      };
    }
  }

  nuevaVenta(form: NgForm) {
    
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.ventaService.generarColumnas(this.isModal);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
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
    if (this.ventaSeleccionado.estadocontrato === 'L') {
      this.mostrarContextMenu(dataSelected, event);
    }
  }

  mostrarContextMenu(data, event) {
    this.ventaSeleccionado = data;
    if (!this.isModal) {
      if (data.estadocontrato === 'L') {
        // this.generarOpciones();
        this.menuOpciones.show(event);
        event.stopPropagation();
      } else {
        this.menuOpciones.hide();
      }
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
