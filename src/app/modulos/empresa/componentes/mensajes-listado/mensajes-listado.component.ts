import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { LS } from 'src/app/contantes/app-constants';
import { MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { MensajeListadoService } from './mensaje-listado.service';
import { MensajeTO } from 'src/app/entidadesTO/empresa/MensajeTO';
import { UtilService } from 'src/app/servicios/util/util.service';
import { GridApi } from 'ag-grid';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mensajes-listado',
  templateUrl: './mensajes-listado.component.html',
  styleUrls: ['./mensajes-listado.component.css']
})
export class MensajesListadoComponent implements OnInit {

  @Input() isModal: boolean;
  @Input() parametrosMensaje: any;
  @Output() enviarAccion = new EventEmitter();
  public constantes: any = LS;
  public isScreamMd: boolean = true;
  public listaResultado: Array<MensajeTO> = [];
  public mensajeSeleccionado: MensajeTO;
  public filtroGlobal: string = "";
  public codigo: string = "";
  public cargando: boolean = false;
  public parametrosFormMensaje: any = null; // para el modal mensaje
  public parametrosFormMail: any = null; // para el modal mensaje
  public listadomensajesAsignados: Array<MensajeTO> = []; // se pasa la lista (es modal)

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
    private utilService: UtilService,
    private toastr: ToastrService,
    private mensajeListadoService: MensajeListadoService
  ) { }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.iniciarAgGrid();
  }

  ngOnChanges(changes) {
    console.log('change mensaje listado');
    if (changes.parametrosMensaje) {
      if (changes.parametrosMensaje.currentValue && changes.parametrosMensaje.currentValue) {
        this.codigo = this.parametrosMensaje.codigo;
        this.listarMensajes(this.parametrosMensaje.activos);
      }
    }
  }

  //
  listarMensajes(activos: boolean) {
    this.cargando = true;
    let parametros = {
      propiedad: this.parametrosMensaje.propiedad,
      propiedad_id: this.parametrosMensaje.propiedad_id,
      activos: activos
    }
    this.mensajeListadoService.listarMensajes(parametros, this);
  }

  despuesDeListarMensajes(data) {
    this.listaResultado = data;
    this.cargando = false;
  }

  generarOpciones() {
    let perConsultar = true;
    let perEliminar = true;
    let perActivar = this.mensajeSeleccionado.estado;
    this.opciones = [
      {
        label: LS.ACCION_CONSULTAR,
        icon: LS.ICON_CONSULTAR,
        disabled: !perConsultar,
        command: () => perConsultar ? this.consultar() : null
      },
      {
        label: LS.ACCION_INACTIVAR,
        icon: LS.ICON_INACTIVAR,
        disabled: !perActivar,
        command: () => perActivar ? this.activarMensaje(false) : null
      },
      {
        label: LS.ACCION_ACTIVAR,
        icon: LS.ICON_ACTIVAR,
        disabled: perActivar,
        command: () => !perActivar ? this.activarMensaje(true) : null
      },
      {
        label: LS.ACCION_ELIMINAR,
        icon: LS.ICON_ELIMINAR,
        disabled: !perEliminar,
        command: () => perEliminar ? this.eliminarMensaje() : null
      },
      {separator:true},
      {
        label: LS.ACCION_ENVIAR_CORREO,
        icon: LS.ICON_MAIL,
        disabled: !perConsultar,
        command: () => perConsultar ? this.enviarMail() : null
      },
    ];
  }

  eliminarMensaje() {
    let parametros = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: LS.MSJ_PREGUNTA_ELIMINAR + "<br>" + LS.TAG_MENSAJE + ": " + this.mensajeSeleccionado.nombres,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ELIMINAR,
      cancelButtonText: LS.MSJ_CANCELAR,
      confirmButtonColor: LS.COLOR_ELIMINAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {
        this.cargando = true;
        let parametros = {
          propiedad: this.parametrosMensaje.propiedad,
          mensaje: this.mensajeSeleccionado,
          propiedad_id: this.parametrosMensaje.propiedad_id, // idCasa o idLote o etc
          cantMensajesActual: this.parametrosMensaje.nmensajes, // cantidad mensajes actual propiedad
        }
        this.mensajeListadoService.eliminarMensaje(parametros, this);
      } else {
        this.cargando = false;
      }
    });
  }

  despuesDeEliminarMensaje(mensaje) {
    this.cargando = false;
    this.refrescarTabla(LS.ACCION_ELIMINAR, mensaje);
  }

  eliminarMensajes() {
    let parametros = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: `${LS.MSJ_PREGUNTA_ELIMINAR} <br/> ${this.listadomensajesAsignados.length} 
      ${LS.TAG_MENSAJES}, ${LS.TAG_PROPIEDAD} : ${this.codigo}`,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ELIMINAR,
      cancelButtonText: LS.MSJ_CANCELAR,
      confirmButtonColor: LS.COLOR_ELIMINAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {
        this.cargando = true;
        const cantMensajesActivados = this.listadomensajesAsignados.filter(mensaje => mensaje.estado == true).length;
        let parametros = {
          listaMensajes: this.listadomensajesAsignados,
          listaIdsMensajes: this.listadomensajesAsignados.map(mensaje => mensaje.id),
          propiedad: this.parametrosMensaje.propiedad,
          propiedad_id: this.parametrosMensaje.propiedad_id, // idCasa o idLote o etc
          cantMensajesActual: this.parametrosMensaje.nmensajes, // cantidad mensajes actual propiedad
          cantMensajesActivados
        }
        this.mensajeListadoService.eliminarMensajes(parametros, this);
      } else {
        this.cargando = false;
      }
    });
  }

  despuesDeEliminarMensajes(mensajes) {
    mensajes.forEach(mensaje => {
      this.refrescarTabla(LS.ACCION_ELIMINAR, mensaje);
    });
    this.cargando = false;
  }

  activarMensajes(estado: boolean) {
    let parametros;
    if (estado) { // activar mensajes
      parametros = {
        title: LS.ACCION_ACTIVAR,
        texto: `${LS.MSJ_PREGUNTA_ACTIVAR} <br> ${this.listadomensajesAsignados.length} 
        ${LS.TAG_MENSAJES}, ${LS.TAG_PROPIEDAD} : ${this.codigo}`,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.LABEL_ACEPTAR,
        cancelButtonText: LS.LABEL_CANCELAR
      };
    } else {
      parametros = {
        title: LS.ACCION_INACTIVAR,
        texto: `${LS.MSJ_PREGUNTA_INACTIVAR} <br> ${this.listadomensajesAsignados.length} 
        ${LS.TAG_MENSAJES}, ${LS.TAG_PROPIEDAD} : ${this.codigo}`,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.LABEL_ACEPTAR,
        cancelButtonText: LS.LABEL_CANCELAR
      };
    }

    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {
        const miestado = !estado;
        const lista = this.listadomensajesAsignados.filter(mensaje => mensaje.estado == miestado);
        if (lista.length > 0) {
          this.cargando = true;
          let parametro = {
            propiedad: this.parametrosMensaje.propiedad,
            propiedad_id: this.parametrosMensaje.propiedad_id, // idCasa o idLote o etc
            cantMensajesActual: this.parametrosMensaje.nmensajes, // cantidad de mensajes actual
            listaIdsMensajes: lista.map(mensaje => mensaje.id),
            listaMensajes: lista,
            estado: estado
          }
          this.mensajeListadoService.cambiarEstadoMensajes(parametro, this);
        } else {
          this.toastr.warning("Los mensajes ya estan "+(estado ? "activos.":"inactivados."), LS.TAG_AVISO);
        }
      } else {
        this.cargando = false;
      }
    });
  }

  despuesCambiarEstadoMensajes(mensajes) {
    mensajes.forEach(mensaje => {
      mensaje.estado = !mensaje.estado;
      this.refrescarTabla(LS.ACCION_EDITAR, mensaje);
    });
    this.cargando = false;
  }

  activarMensaje(estado: boolean) {
    let parametros;
    if (!estado) {
      parametros = {
        title: LS.ACCION_INACTIVAR,
        texto: LS.MSJ_PREGUNTA_INACTIVAR + "<br> " + LS.TAG_MENSAJE + ": " + this.mensajeSeleccionado.nombres,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.LABEL_ACEPTAR,
        cancelButtonText: LS.LABEL_CANCELAR
      };
    } else {
      parametros = {
        title: LS.ACCION_ACTIVAR,
        texto: LS.MSJ_PREGUNTA_ACTIVAR + "<br> " + LS.TAG_MENSAJE + ": " + this.mensajeSeleccionado.nombres,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.LABEL_ACEPTAR,
        cancelButtonText: LS.LABEL_CANCELAR
      };
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {
        this.cargando = true;
        let parametro = {
          propiedad: this.parametrosMensaje.propiedad,
          propiedad_id: this.parametrosMensaje.propiedad_id,
          mensaje: this.mensajeSeleccionado,
          cantMensajesActual: this.parametrosMensaje.nmensajes, // cantidas de mensajes actual
          estado: estado
        }
        this.mensajeListadoService.cambiarEstadoMensaje(parametro, this);
      } else {
        this.cargando = false;
      }
    });
  }

  despuesCambiarEstadoMensaje(mensaje) {
    mensaje.estado = !mensaje.estado;
    this.refrescarTabla(LS.ACCION_EDITAR, mensaje);
    this.cargando = false;
  }

  refrescarTabla(accion: string, mensajeTO: MensajeTO) {
    switch(accion) {
      case LS.ACCION_EDITAR: { // Actualiza un elemento en la tabla
        var indexTemp = this.listaResultado.findIndex(item => item.id === mensajeTO.id);
        let listaTemporal = [... this.listaResultado];
        listaTemporal[indexTemp] = mensajeTO;
        this.listaResultado = listaTemporal;
        this.mensajeSeleccionado = this.listaResultado[indexTemp];
        // this.seleccionarFila(indexTemp);
        break;
      }
      case LS.ACCION_ELIMINAR: { // Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listaResultado.findIndex(item => item.id === mensajeTO.id);
        let listaTemporal = [...this.listaResultado];
        listaTemporal.splice(indexTemp, 1);
        this.listaResultado = listaTemporal;
        // (this.listaResultado.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  consultar() {
    this.mostrarModalMensaje();
  }

  // modal de mostrar modal formulario mensaje
  mostrarModalMensaje() {
    this.parametrosFormMensaje = {
      display: true,
      mensaje: this.mensajeSeleccionado,
      codigo: this.codigo,
      accion: LS.ACCION_CONSULTAR
    }
  }

  onDialogClose(event) {
    this.parametrosFormMensaje = null;
  } //

  selectionChanged() {
    this.listadomensajesAsignados = this.utilService.getAGSelectedData(this.gridApi);
  }

 // modal formulario enviar mail
 enviarMail() {
  this.mostrarModalMail();
 }

 mostrarModalMail() {
  this.parametrosFormMail = {
    display: true,
    mensajeTO: this.mensajeSeleccionado,
    codigo: this.codigo,
    accion: LS.ACCION_EDITAR
  }
 }

 onDialogCloseMail(event) {
  this.parametrosFormMail = null;
} //

  // boton regresar
  cancelar() {
    const nmensajes = this.listaResultado.filter(mensaje => mensaje.estado == true).length;
    this.parametrosMensaje.objetoSeleccionado.nmensajes = nmensajes;
    let parametros = {
      accion : LS.ACCION_CONSULTAR,
      cerrarListado: true,
      objetoSeleccionado: this.parametrosMensaje.objetoSeleccionado
    }
    this.enviarAccion.emit(parametros);
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.mensajeListadoService.generarColumnas(this.isModal);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
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
    this.mensajeSeleccionado = data;
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

  filaSeleccionar() {}

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.mensajeSeleccionado = fila ? fila.data : null;
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
