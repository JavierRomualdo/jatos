import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { CocheraTO } from 'src/app/entidadesTO/empresa/CocheraTO';
import { LS } from 'src/app/contantes/app-constants';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid-community';
import { ContextMenu } from 'primeng/contextmenu';
import { CocheraService } from '../../propiedades/cocheras/cochera.service';
import { UtilService } from 'src/app/servicios/util/util.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cocheras-listado',
  templateUrl: './cocheras-listado.component.html',
  styleUrls: ['./cocheras-listado.component.css']
})
export class CocherasListadoComponent implements OnInit {

  @Input() parametrosBusqueda: any = null;//parametros de busqueda
  @Input() isModal: boolean = false; // establecemos si este componente es modal o no 
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();

  public cargando: boolean = false;
  public listadoCocheras: Array<CocheraTO> = []; // lista cocheras
  public objetoSeleccionado: CocheraTO;

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
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  constructor(
    private cocheraService: CocheraService,
    private utilService: UtilService,
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.localeText = { noRowsToShow: 'No se encontraron cocheras', page: "Página", of: "de", to: "a" };
    if (this.isModal) {
      this.listarCocherasParaTipoContrato(this.parametrosBusqueda);
    }
    this.iniciarAgGrid();
  }

  ngOnChanges(changes) {
    console.log('change cochera listado');
    if (changes.parametrosBusqueda) {
      if (changes.parametrosBusqueda.currentValue && changes.parametrosBusqueda.currentValue.listar) {
        if (this.parametrosBusqueda.accion) {
          // aca se refresca la tabla (accion: nuevo o editar)
          console.log('refrescar tabla aqui');
          console.log(this.parametrosBusqueda.data);
          this.refrescarTabla(this.parametrosBusqueda.accion, this.parametrosBusqueda.data);
        } else {
          // aca son las consultas en general para listado de cochers
          if (this.parametrosBusqueda.estadoContrato === null) {
            this.listarCasas(this.parametrosBusqueda.activos);
          } else {
            this.listarCocherasPorEstadoContrato(this.parametrosBusqueda.estadoContrato);
          }
        }
      }
    }
  }

  refrescarTabla(accion, cocheraTO: CocheraTO) {
    switch(accion) {
      case LS.ACCION_NUEVO: { // Insertar un elemento en la tabla
        let listaTemporal = [... this.listadoCocheras];
        listaTemporal.unshift(cocheraTO);
        this.listadoCocheras = listaTemporal;
        // this.seleccionarFila(0);
        break;
      }
      case LS.ACCION_EDITAR: { // Actualiza un elemento en la tabla
        var indexTemp = this.listadoCocheras.findIndex(item => item.codigo === cocheraTO.codigo);
        let listaTemporal = [... this.listadoCocheras];
        listaTemporal[indexTemp] = cocheraTO;
        this.listadoCocheras = listaTemporal;
        this.objetoSeleccionado = this.listadoCocheras[indexTemp];
        // this.seleccionarFila(indexTemp);
        break;
      }
      case LS.ACCION_ELIMINAR: { // Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listadoCocheras.findIndex(item => item.codigo === cocheraTO.codigo);
        let listaTemporal = [...this.listadoCocheras];
        listaTemporal.splice(indexTemp, 1);
        this.listadoCocheras = listaTemporal;
        // (this.listadoCocheras.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  listarCasas(activos: boolean) {
    this.cargando = true;
    let parametros = {
      activos: activos
    }
    this.cocheraService.listarCocheras(parametros, this);
  }

  despuesDeListarCocheras(data) {
    this.listadoCocheras = data;
    this.cargando = false;
  }

  listarCocherasPorEstadoContrato(estadoContrato: string) {
    this.cargando = true;
    let parametros = {
      estadoContrato: estadoContrato
    }
    this.cocheraService.listarCocherasPorEstadoContrato(parametros, this);
  }

  despuesDeListarCocherasPorEstadoContrato(data) {
    this.listadoCocheras = data;
    this.cargando = false;
  }

  // listado que muestra como modal en ventas y alquileres
  listarCocherasParaTipoContrato(parametro) {
    this.cargando = true;
    this.cocheraService.listarCocherasParaTipoContrato(parametro, this);
  }

  despuesDeListarCocherasParaTipoContrato(data) {
    this.listadoCocheras = data;
    this.cargando = false;
  }

  nuevaCochera() {
    // necesito la ultima casa para generar mi siguiente codigo de mi nueva propiedad
    const ids = this.listadoCocheras.map(casa => casa.id);
    const idMax = Math.max(...ids);
    const ultimaCochera = this.listadoCocheras.find(casa => casa.id == idMax);
    this.emitirAccion(LS.ACCION_NUEVO, ultimaCochera);
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
  
  /**Modal de cochera-listado*/
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
          command: () => perModificar ? this.activarCochera(false) : null
        },
        {
          label: LS.ACCION_ACTIVAR,
          icon: LS.ICON_ACTIVAR,
          disabled: !perActivar,
          command: () => perActivar ? this.activarCochera(true) : null
        },
        {
          label: LS.ACCION_ELIMINAR,
          icon: LS.ICON_ELIMINAR,
          disabled: !perEliminar,
          command: () => perEliminar ? this.eliminarCochera() : null
        }
      ) : null;
      
      this.opciones.push(
        {
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
          command: () => perImprimir ? this.imprimirDetalleCochera() : null
        }
      );
  }

  // aca pasa los parametros pasa a cocheraComponent y luego al modal cochera
  emitirAccion(accion, seleccionado) {
    this.accion = accion;
    if (accion === LS.ACCION_CONSULTAR || accion === LS.ACCION_EDITAR) {
      this.cargando = true;
      this.mostarCochera(seleccionado.id);
    } else {
      let parametros = {
        accion: accion, // accion nuevo
        cochera: seleccionado,
        verMensajes: false
      }
      this.enviarAccion.emit(parametros);
    }
  }

  mostarCochera(id) {
    // para consultar y editar en modal cochera
    this.cargando = true;
    this.cocheraService.mostrarCochera(id, this);
  }

  despuesDeMostrarCochera(data) {
    this.cargando = false;
    let parametros = {
      accion: this.accion,
      cochera: data,
      verMensajes: false
    }
    this.enviarAccion.emit(parametros);
  }

  activarCochera(estado) {
    let parametros;
    if (!estado) {
      // this.accion = LS.ACCION_INACTIVAR;
      parametros = {
        title: LS.ACCION_INACTIVAR,
        texto: LS.MSJ_PREGUNTA_INACTIVAR + "<br> " + LS.TAG_COCHERA + ": " + this.objetoSeleccionado.codigo,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.LABEL_ACEPTAR,
        cancelButtonText: LS.LABEL_CANCELAR
      };
    } else {
      // this.accion = LS.ACCION_ACTIVAR;
      parametros = {
        title: LS.ACCION_ACTIVAR,
        texto: LS.MSJ_PREGUNTA_ACTIVAR + "<br> " + LS.TAG_COCHERA + ": " + this.objetoSeleccionado.codigo,
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
        this.cocheraService.cambiarEstadoCochera(parametro, this);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesDeCambiarEstadoCochera(data) {
    this.objetoSeleccionado.estado = !this.objetoSeleccionado.estado;
    this.refrescarTabla(LS.ACCION_EDITAR, this.objetoSeleccionado);
    this.cargando = false;
  }

  eliminarCochera() {
    // this.accion = LS.ACCION_ELIMINAR;
    let parametros = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: LS.MSJ_PREGUNTA_ELIMINAR + "<br>" + LS.TAG_COCHERA + ": " + this.objetoSeleccionado.codigo,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ELIMINAR,
      cancelButtonText: LS.MSJ_CANCELAR,
      confirmButtonColor: LS.COLOR_ELIMINAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.cargando = true;
        this.cocheraService.eliminarCochera(this.objetoSeleccionado.id, this);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesDeEliminarCochera(data) {
    this.cargando = false;
    console.log('se ha elimnado cochera:');
    console.log(data);
    this.refrescarTabla(LS.ACCION_ELIMINAR, this.objetoSeleccionado);
  }

  // metodo que se abre la ventana del listado de mensajes
  verMensajes() {
    let parametros = {
      propiedad: LS.TAG_HABITACION,
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
      data: this.listadoCocheras,
      estadocontrato: this.parametrosBusqueda.estadoContrato ? this.parametrosBusqueda.estadoContrato : null,
      activos: this.parametrosBusqueda.activos ? this.parametrosBusqueda.activos : false
    }
    this.cocheraService.imprimirCocheras(parametros, this);
  }

  imprimirDetalleCochera() {
    this.cargando = true;
    let parametros = {
      cochera: this.objetoSeleccionado,
      fechaActual: this.utilService.obtenerFechaActual()
    }
    this.cocheraService.imprimirCocheraDetalle(parametros, this);
  }

  exportarCocheras() {
    this.cargando = true;
    let parametros = {
      fechaActual: this.utilService.obtenerFechaActual(),
      data: this.listadoCocheras
    }
    this.cocheraService.exportarExcelCocheras(parametros, this);
  }
  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.cocheraService.generarColumnas(this.isModal);
    this.rowClassRules = this.cocheraService.generarReglaPaFilasConMensajes();
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
