import { Component, OnInit, Input, Output, ViewChild, HostListener, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { CasasService } from '../../propiedades/casas/casas.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LS } from 'src/app/contantes/app-constants';
import { UtilService } from 'src/app/servicios/util/util.service';
import { CasaTO } from 'src/app/entidadesTO/empresa/CasaTO';
@Component({
  selector: 'app-casas-listado',
  templateUrl: './casas-listado.component.html',
  styleUrls: ['./casas-listado.component.css']
})
export class CasasListadoComponent implements OnInit {

  @Input() parametrosBusqueda: any = null;//parametros de busqueda
  @Input() isModal: boolean = false; // establecemos si este componente es modal o no 
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();

  public cargando: boolean = false;
  public listadoCasas: Array<CasaTO> = []; // lista casas
  public objetoSeleccionado: CasaTO;

  public filtroGlobal: string = "";
  public enterKey: number = 0;//Suma el numero de enter
  public activar: boolean = false;
  public constantes: any = LS;
  public accion: string = null;

  public parametrosFoto: any = null

  innerWidth: number;
  isScreamMd: boolean;//Identifica si la pantalla es tamaño MD
  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public localeText = {};
  public context;
  public rowClassRules;
  overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>';
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  constructor(
    private casasService: CasasService,
    private utilService: UtilService,
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.localeText = { noRowsToShow: 'No se encontraron casas', page: "Página", of: "de", to: "a" };
    if (this.isModal) {
      this.listarCasasParaTipoContrato(this.parametrosBusqueda);
    }
    this.iniciarAgGrid();
  }

  ngOnChanges(changes) {
    console.log('change casa listado');
    if (changes.parametrosBusqueda) {
      if (changes.parametrosBusqueda.currentValue && changes.parametrosBusqueda.currentValue.listar) {
        if (this.parametrosBusqueda.accion) {
          // aca se refresca la tabla (accion: nuevo o editar)
          console.log('refrescar tabla aqui');
          console.log(this.parametrosBusqueda.data);
          this.refrescarTabla(this.parametrosBusqueda.accion, this.parametrosBusqueda.data);
        } else {
          // aca son las consultas en general para listado de casas
          if (this.parametrosBusqueda.estadoContrato === null) {
            this.listarCasas(this.parametrosBusqueda.activos);
          } else {
            this.listarCasasPorEstadoContrato(this.parametrosBusqueda.estadoContrato);
          }
        }
      }
    }
  }

  refrescarTabla(accion, casaTO: CasaTO) {
    switch(accion) {
      case LS.ACCION_NUEVO: { // Insertar un elemento en la tabla
        let listaTemporal = [... this.listadoCasas];
        listaTemporal.unshift(casaTO);
        this.listadoCasas = listaTemporal;
        // this.seleccionarFila(0);
        break;
      }
      case LS.ACCION_EDITAR: { // Actualiza un elemento en la tabla
        var indexTemp = this.listadoCasas.findIndex(item => item.codigo === casaTO.codigo);
        let listaTemporal = [... this.listadoCasas];
        listaTemporal[indexTemp] = casaTO;
        this.listadoCasas = listaTemporal;
        this.objetoSeleccionado = this.listadoCasas[indexTemp];
        // this.seleccionarFila(indexTemp);
        break;
      }
      case LS.ACCION_ELIMINAR: { // Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listadoCasas.findIndex(item => item.codigo === casaTO.codigo);
        let listaTemporal = [...this.listadoCasas];
        listaTemporal.splice(indexTemp, 1);
        this.listadoCasas = listaTemporal;
        // (this.listadoCasas.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  listarCasas(activos: boolean) {
    this.cargando = true;
    let parametros = {
      activos: activos
    }
    this.casasService.listarCasas(parametros, this);
  }

  despuesDeListarCasas(data) {
    this.listadoCasas = data;
    this.cargando = false;
  }

  listarCasasPorEstadoContrato(estadoContrato: string) {
    this.cargando = true;
    let parametros = {
      estadoContrato: estadoContrato
    }
    this.casasService.listarCasasPorEstadoContrato(parametros, this);
  }

  despuesDeListarCasasPorEstadoContrato(data) {
    this.listadoCasas = data;
    this.cargando = false;
  }

  // listado que muestra como modal en ventas y alquileres
  listarCasasParaTipoContrato(parametro) {
    this.cargando = true;
    this.casasService.listarCasasParaTipoContrato(parametro, this);
  }

  despuesDeListarCasasParaTipoContrato(data) {
    this.listadoCasas = data;
    this.cargando = false;
  }

  nuevaCasa() {
    // necesito la ultima casa para generar mi siguiente codigo de mi nueva propiedad
    const ids = this.listadoCasas.map(casa => casa.id);
    const idMax = Math.max(...ids);
    const ultimaCasa = this.listadoCasas.find(casa => casa.id == idMax);
    this.emitirAccion(LS.ACCION_NUEVO, ultimaCasa);
  }

  consultar() {
    this.emitirAccion(LS.ACCION_CONSULTAR, this.objetoSeleccionado);
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

  cambiarActivar(estado) {
    this.activar = !estado;
    this.enviarActivar.emit(estado);
  }

  generarOpciones() {
    let perConsultar = true;
    let perMensajes = true;
    let perImprimir = true;
    let perModificar = this.objetoSeleccionado.estadocontrato === 'L' ? true : false;
    let perEliminar = this.objetoSeleccionado.estadocontrato === 'L' ? true : false;
    let perInactivar = this.objetoSeleccionado.estadocontrato === 'L' ? this.objetoSeleccionado.estado : false; //empInactivo
    let perActivar = this.objetoSeleccionado.estadocontrato === 'L' ? !this.objetoSeleccionado.estado : false;
    this.opciones = [
      {
        label: LS.ACCION_CONSULTAR,
        icon: LS.ICON_CONSULTAR,
        disabled: !perConsultar,
        command: () => perConsultar ? this.emitirAccion(LS.ACCION_CONSULTAR, this.objetoSeleccionado) : null
      }
    ];

    this.objetoSeleccionado.estadocontrato === 'L' ? 
      this.opciones.push(
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
          command: () => perModificar ? this.activarCasa(false) : null
        },
        {
          label: LS.ACCION_ACTIVAR,
          icon: LS.ICON_ACTIVAR,
          disabled: !perActivar,
          command: () => perActivar ? this.activarCasa(true) : null
        },
        {
          label: LS.ACCION_ELIMINAR,
          icon: LS.ICON_ELIMINAR,
          disabled: !perEliminar,
          command: () => perEliminar ? this.eliminarCasa() : null
        }
      ) : null;
      
      this.opciones.push(
        {
          // <span class="badge badge-danger">{{not.cantidad}}</span>
          label: (this.objetoSeleccionado.nmensajes>0 ? this.objetoSeleccionado.nmensajes+" " : "") + LS.TAG_MENSAJES,
          icon: LS.ICON_NOTIFICACION,
          disabled: !perMensajes,
          command: () => perMensajes ? this.verMensajes() : null
        },
        {separator:true},
        {
          label: LS.ACCION_IMPRIMIR,
          icon: LS.ICON_IMPRIMIR,
          disabled: !perImprimir,
          command: () => perImprimir ? this.imprimirDetalleCasa() : null
        }
      );
  }

  // aca pasa los parametros pasa a casaComponent y luego al modal casa
  emitirAccion(accion, seleccionado) {
    this.accion = accion;
    if (accion === LS.ACCION_CONSULTAR || accion === LS.ACCION_EDITAR) {
      this.cargando = true;
      this.mostrarCasa(seleccionado.id);
    } else {
      let parametros = {
        accion: accion, // accion nuevo
        casa: seleccionado,
        verMensajes: false
      }
      this.enviarAccion.emit(parametros);
    }
  }

  mostrarCasa(id) {
    // para consultar y editar en modal casa
    this.cargando = true;
    this.casasService.mostrarCasa(id, this);
  }

  despuesDeMostrarCasa(data) {
    this.cargando = false;
    let parametros = {
      accion: this.accion,
      casa: data,
      verMensajes: false
    }
    this.enviarAccion.emit(parametros);
  }

  activarCasa(estado) {
    let parametros;
    if (!estado) {
      // this.accion = LS.ACCION_INACTIVAR;
      parametros = {
        title: LS.ACCION_INACTIVAR,
        texto: LS.MSJ_PREGUNTA_INACTIVAR + "<br> " + LS.TAG_CASA + ": " + this.objetoSeleccionado.codigo,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.LABEL_ACEPTAR,
        cancelButtonText: LS.LABEL_CANCELAR
      };
    } else {
      // this.accion = LS.ACCION_ACTIVAR;
      parametros = {
        title: LS.ACCION_ACTIVAR,
        texto: LS.MSJ_PREGUNTA_ACTIVAR + "<br> " + LS.TAG_CASA + ": " + this.objetoSeleccionado.codigo,
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
          codigo: this.objetoSeleccionado.codigo,
          activar: estado
        }
        this.casasService.cambiarEstadoCasa(parametro, this);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesCambiarEstadoCasa(data) {
    this.objetoSeleccionado.estado = !this.objetoSeleccionado.estado;
    this.refrescarTabla(LS.ACCION_EDITAR, this.objetoSeleccionado);
    this.cargando = false;
  }

  eliminarCasa() {
    // this.accion = LS.ACCION_ELIMINAR;
    let parametros = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: LS.MSJ_PREGUNTA_ELIMINAR + "<br>" + LS.TAG_CASA + ": " + this.objetoSeleccionado.codigo,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ELIMINAR,
      cancelButtonText: LS.MSJ_CANCELAR,
      confirmButtonColor: LS.COLOR_ELIMINAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.cargando = true;
        this.casasService.eliminarCasa(this.objetoSeleccionado.id, this);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesDeEliminarCasa(data) {
    this.cargando = false;
    console.log('se ha elimnado casa:');
    console.log(data);
    this.refrescarTabla(LS.ACCION_ELIMINAR, this.objetoSeleccionado);
  }

  // metodo que se abre la ventana del listado de mensajes
  verMensajes() {
    let parametros = {
      propiedad: LS.TAG_CASA,
      propiedad_id: this.objetoSeleccionado.id,
      codigo: this.objetoSeleccionado.codigo,
      activos: false,
      nmensajes: this.objetoSeleccionado.nmensajes,
      objetoSeleccionado: this.objetoSeleccionado,
      verMensajes: true
    }
    this.enviarAccion.emit(parametros);
  }

  imprimir() {
    this.cargando = true;
    let parametros = {
      fechaActual: this.utilService.obtenerFechaActual(),
      data: this.listadoCasas,
      estadocontrato: this.parametrosBusqueda.estadoContrato ? this.parametrosBusqueda.estadoContrato : null,
      activos: this.parametrosBusqueda.activos ? this.parametrosBusqueda.activos : false
    }
    this.casasService.imprimirCasas(parametros, this);
  }

  imprimirDetalleCasa() {
    this.cargando = true;
    let parametros = {
      casa: this.objetoSeleccionado,
      fechaActual: this.utilService.obtenerFechaActual()
    }
    this.casasService.imprimirCasaDetalle(parametros, this);
  }

  exportarCasas() {
    this.cargando = true;
    let parametros = {
      fechaActual: this.utilService.obtenerFechaActual(),
      data: this.listadoCasas
    }
    this.casasService.exportarExcelCasas(parametros, this);
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.casasService.generarColumnas(this.isModal);
    this.rowClassRules = this.casasService.generarReglaPaFilasConMensajes();
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
    if (!this.isModal) {
      this.generarOpciones();
      this.menuOpciones.show(event);
      event.stopPropagation();
      // this.menuOpciones.hide();
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
    this.objetoSeleccionado = fila ? fila.data : null;
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    // setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null;
    // if (this.listadoCasas.length>0) {
    //   this.gridApi.hideOverlay();
    // } else {
    //   this.gridApi.showLoadingOverlay();
    // }
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
