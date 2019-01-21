import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { LS } from 'src/app/contantes/app-constants';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid-community';
import { ContextMenu } from 'primeng/contextmenu';
import { Servicios } from 'src/app/entidades/entidad.servicios';
import { ServicioService } from '../../configuracion/servicios/servicio.service';
import { UtilService } from 'src/app/servicios/util/util.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-servicios-listado',
  templateUrl: './servicios-listado.component.html',
  styleUrls: ['./servicios-listado.component.css']
})
export class ServiciosListadoComponent implements OnInit {

  @Input() parametrosBusqueda: any = null;//parametros de busqueda
  @Input() isModal: boolean = false; // establecemos si este componente es modal o no 
  public cargando: boolean = false;
  public listadoServicios: Array<Servicios> = []; // lista casas
  public objetoSeleccionado: Servicios; //
  public parametrosFormulario: any = null;

  public filtroGlobal: string = "";
  public enterKey: number = 0;//Suma el numero de enter
  public vistaFormulario: boolean = false;
  public constantes: any = LS;
  public accion: string = null;
  

  innerWidth: number;
  isScreamMd: boolean;//Identifica si la pantalla es tamaño MD
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
    private servicioService: ServicioService,
    private utilService: UtilService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    if (this.isModal) {
      this.listarServicios(false);
      // this.listarCasasParaTipoContrato(this.parametrosBusqueda);
    }
    this.iniciarAgGrid();
  }

  ngOnChanges(changes) {
    console.log('change casa listado');
    if (changes.parametrosBusqueda) {
      if (changes.parametrosBusqueda.currentValue && changes.parametrosBusqueda.currentValue.listar) {
        this.isModal = this.parametrosBusqueda.isModal;
        if (this.parametrosBusqueda.accion) {
          // accion = nuevo
          this.nuevaServicio();
        } else {
          // aca son las consultas en general para listado de casas
          this.listarServicios(this.parametrosBusqueda.activos);
        }
      }
    }
  }

  refrescarTabla(accion, servicioTO: Servicios) {
    switch(accion) {
      case LS.ACCION_NUEVO: { // Insertar un elemento en la tabla
        let listaTemporal = [... this.listadoServicios];
        listaTemporal.unshift(servicioTO);
        this.listadoServicios = listaTemporal;
        // this.seleccionarFila(0);
        break;
      }
      case LS.ACCION_EDITAR: { // Actualiza un elemento en la tabla
        var indexTemp = this.listadoServicios.findIndex(item => item.id === servicioTO.id);
        let listaTemporal = [... this.listadoServicios];
        listaTemporal[indexTemp] = servicioTO;
        this.listadoServicios = listaTemporal;
        this.objetoSeleccionado = this.listadoServicios[indexTemp];
        // this.seleccionarFila(indexTemp);
        break;
      }
      case LS.ACCION_ELIMINAR: { // Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listadoServicios.findIndex(item => item.id === servicioTO.id);
        let listaTemporal = [...this.listadoServicios];
        listaTemporal.splice(indexTemp, 1);
        this.listadoServicios = listaTemporal;
        // (this.listadoServicios.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  listarServicios(activos) {
    this.cargando = true;
    let parametros = {
      activos: activos
    }
    this.servicioService.listarServicios(parametros, this);
  }

  despuesDeListarServicios(data) {
    this.listadoServicios = data;
    this.cargando = false;
    console.log(data);
  }

  nuevaServicio() {
    this.emitirAccion(LS.ACCION_NUEVO, null);
  }

  consultar() {
    this.emitirAccion(LS.ACCION_CONSULTAR, this.objetoSeleccionado);
  }
  
  /**Modal de casa-listado*/
  filaSeleccionar() {
    this.enviarItem(this.objetoSeleccionado);
  }

  ejecutarSpanAccion(event, data) {
    this.enviarItem(data);
  }

  enviarItem(item) {
    this.activeModal.close(item);
  }

  generarOpciones() {
    let perConsultar = true;
    let perModificar = true;
    let perEliminar = true;
    let perInactivar = this.objetoSeleccionado.estado; //empInactivo
    let perActivar = !this.objetoSeleccionado.estado;
    this.opciones = [
      {
        label: LS.ACCION_CONSULTAR,
        icon: LS.ICON_CONSULTAR,
        disabled: !perConsultar,
        command: () => perConsultar ? this.emitirAccion(LS.ACCION_CONSULTAR, this.objetoSeleccionado) : null
      },
      {
        label: LS.ACCION_EDITAR,
        icon: LS.ICON_EDITAR,
        disabled: !perModificar,
        command: () => perModificar ? this.emitirAccion(LS.ACCION_EDITAR, this.objetoSeleccionado) : null
      },
      {
        label: LS.ACCION_INACTIVAR,
        icon: LS.ICON_INACTIVAR,
        disabled: !perInactivar,
        command: () => perModificar ? this.activarServicio(false) : null
      },
      {
        label: LS.ACCION_ACTIVAR,
        icon: LS.ICON_ACTIVAR,
        disabled: !perActivar,
        command: () => perActivar ? this.activarServicio(true) : null
      },
      {
        label: LS.ACCION_ELIMINAR,
        icon: LS.ICON_ELIMINAR,
        disabled: !perEliminar,
        command: () => perEliminar ? this.eliminarServicio() : null
      }
    ];
  }

  // aca pasa los parametros pasa a casaComponent y luego al modal casa
  emitirAccion(accion: string, seleccionado: Servicios) {
    this.accion = accion;
    if (accion === LS.ACCION_CONSULTAR || accion === LS.ACCION_EDITAR) {
      this.mostrarServicio(seleccionado);
    } else {
      let parametros = {
        accion: accion, // accion nuevo
        servicio: null
      }
      this.vistaFormulario = true;
      this.parametrosFormulario = parametros;
      // this.enviarAccion.emit(parametros);
    }
  }

  mostrarServicio(seleccionado: Servicios) {
    // para consultar y editar en modal servicio
    this.vistaFormulario = true;
    this.parametrosFormulario = {
      accion: this.accion,
      servicio: seleccionado
    }
    // this.enviarAccion.emit(parametros);
  }

  activarServicio(estado) {
    let parametros;
    if (!estado) {
      // this.accion = LS.ACCION_INACTIVAR;
      parametros = {
        title: LS.ACCION_INACTIVAR,
        texto: LS.MSJ_PREGUNTA_INACTIVAR + "<br> " + LS.TAG_SERVICIO + ": " + this.objetoSeleccionado.servicio,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.LABEL_ACEPTAR,
        cancelButtonText: LS.LABEL_CANCELAR
      };
    } else {
      // this.accion = LS.ACCION_ACTIVAR;
      parametros = {
        title: LS.ACCION_ACTIVAR,
        texto: LS.MSJ_PREGUNTA_ACTIVAR + "<br> " + LS.TAG_SERVICIO + ": " + this.objetoSeleccionado.servicio,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.LABEL_ACEPTAR,
        cancelButtonText: LS.LABEL_CANCELAR
      };
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.cargando = true;
        // this.objetoSeleccionado.estado = estado;
        let parametro = {
          id: this.objetoSeleccionado.id,
          nombres: this.objetoSeleccionado.servicio,
          activar: estado
        }
        this.servicioService.cambiarEstadoServicio(parametro, this);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesDeCambiarEstadoServicio(data) {
    this.objetoSeleccionado.estado = !this.objetoSeleccionado.estado;
    this.refrescarTabla(LS.ACCION_EDITAR, this.objetoSeleccionado);
    this.cargando = false;
  }

  eliminarServicio() {
    // this.accion = LS.ACCION_ELIMINAR;
    let parametros = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: LS.MSJ_PREGUNTA_ELIMINAR + "<br>" + LS.TAG_SERVICIO + ": " + this.objetoSeleccionado.servicio,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ELIMINAR,
      cancelButtonText: LS.MSJ_CANCELAR,
      confirmButtonColor: LS.COLOR_ELIMINAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.cargando = true;
        this.servicioService.eliminarServicio(this.objetoSeleccionado.id, this);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesDeEliminarServicio(data) {
    this.cargando = false;
    console.log('se ha elimnado casa:');
    console.log(data);
    this.refrescarTabla(LS.ACCION_ELIMINAR, this.objetoSeleccionado);
  }

  imprimirCasas() {}

  ejecutarAccionPaFormulario(data) { // oriden del formulario de personas
    // data {accion: string . persona: Servicio}
    switch (data.accion) {
      case LS.ACCION_NUEVO:
      case LS.ACCION_EDITAR:
      case LS.ACCION_CONSULTAR:
        this.refrescarTabla(data.accion, data.servicio);
        this.vistaFormulario = false;
        break;
      case LS.ACCION_CANCELAR:
        this.vistaFormulario = false;
        break;
      default:
        break;
    }
  }
  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.servicioService.generarColumnas(this.isModal);
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
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
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
    this.objetoSeleccionado = fila ? fila.data : null;
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

  /*Metodos para seleccionar producto con ENTER O DOBLECLICK */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isModal) {
      if (event.keyCode === 13) {
        if (this.enterKey > 0) {
          this.enviarItem(this.objetoSeleccionado);
        }
        this.enterKey = this.enterKey + 1;
      }
    }
  }
}
