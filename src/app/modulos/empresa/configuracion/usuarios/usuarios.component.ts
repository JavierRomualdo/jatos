import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { UsuarioTO } from 'src/app/entidadesTO/empresa/UsuarioTO';
import { LS } from 'src/app/contantes/app-constants';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid-community';
import { ContextMenu } from 'primeng/contextmenu';
import { UtilService } from 'src/app/servicios/util/util.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ObjetoJWT } from 'src/app/servicios/auth.service';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  @Input() isModal: boolean = false; // establecemos si este componente es modal o no 

  public cargando: boolean = false;
  public listadoUsuarios: Array<UsuarioTO> = []; // lista usuarios
  public objetoSeleccionado: UsuarioTO;

  public filtroGlobal: string = "";
  public enterKey: number = 0;//Suma el numero de enter
  public activar: boolean = false;
  public constantes: any = LS;
  public accion: string = null;

  public parametrosFoto: any = null
  public parametrosFormulario: any
  public vistaFormulario: boolean = false;
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
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  
  constructor(
    private usuarioService: UsuarioService,
    private utilService: UtilService,
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.localeText = { noRowsToShow: 'No se encontraron usuarios', page: "Página", of: "de", to: "a" };
    if (LS.KEY_IS_PERFIL_USER) {
      let objJWT: ObjetoJWT = JSON.parse(localStorage.getItem(LS.KEY_CURRENT_USER));
      this.editarUsuario(parseInt(objJWT.userId));
    } else {
      this.listarUsuarios()
      this.iniciarAgGrid();
    }
  }

  listarUsuarios() {
    this.cargando = true;
    this.usuarioService.listarUsuarios(this);
  }

  despuesDeListarUsuarios(data) {
    this.listadoUsuarios = data;
    this.cargando = false;
  }

  filaSeleccionar() {
    this.consultarUsuario(this.objetoSeleccionado);
  }

  generarOpciones() {
    let perConsultar = true;
    let perMensajes = true;
    let perModificar = true;
    let perEliminar = true;
    let perInactivar =  this.objetoSeleccionado.estado; //empInactivo
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
        command: () => perModificar ? this.activarUsuario(false) : null
      },
      {
        label: LS.ACCION_ACTIVAR,
        icon: LS.ICON_ACTIVAR,
        disabled: !perActivar,
        command: () => perActivar ? this.activarUsuario(true) : null
      },
      {
        label: LS.ACCION_ELIMINAR,
        icon: LS.ICON_ELIMINAR,
        disabled: !perEliminar,
        command: () => perEliminar ? this.emitirAccion(LS.ACCION_ELIMINAR, this.objetoSeleccionado ) : null
      }
    ];
  }

  emitirAccion(accion: string, usuario: UsuarioTO) {
    switch (accion) {
      case LS.ACCION_CONSULTAR:
        this.consultarUsuario(usuario);
        break;
      case LS.ACCION_EDITAR:
        this.editarUsuario();
        break;
      case LS.ACCION_ELIMINAR:
        this.eliminarUsuario();
        break;
      default:
        break;
    }
  }

  consultarUsuario(usuario ?: UsuarioTO ) {
    this.parametrosFormulario = {
      accion: LS.ACCION_CONSULTAR,
      id: usuario ? usuario.id : this.objetoSeleccionado.id,
      isModal: false
    }
    this.vistaFormulario = true;
  }

  editarUsuario(id ?: number ) {
    this.parametrosFormulario = {
      accion: LS.ACCION_EDITAR,
      id: id ? id : this.objetoSeleccionado.id,
      isModal: false
    }
    this.vistaFormulario = true;
  }

  eliminarUsuario() {
    let parametros = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: LS.MSJ_PREGUNTA_ELIMINAR + "<br>" + LS.TAG_USUARIO + ": " + this.objetoSeleccionado.name,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ELIMINAR,
      cancelButtonText: LS.MSJ_CANCELAR,
      confirmButtonColor: LS.COLOR_ELIMINAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.cargando = true;
        this.usuarioService.eliminarUsuario(this.objetoSeleccionado.id, this);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesDeEliminarUsuario(data) {
    this.cargando = false;
    console.log('se ha elimnado casa:');
    console.log(data);
    this.refrescarTabla(LS.ACCION_ELIMINAR, this.objetoSeleccionado);
  }

  activarUsuario(estado) {
    let parametros;
    if (!estado) {
      // this.accion = LS.ACCION_INACTIVAR;
      parametros = {
        title: LS.ACCION_INACTIVAR,
        texto: LS.MSJ_PREGUNTA_INACTIVAR + "<br> " + LS.TAG_USUARIO + ": " + this.objetoSeleccionado.name,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.LABEL_ACEPTAR,
        cancelButtonText: LS.LABEL_CANCELAR
      };
    } else {
      // this.accion = LS.ACCION_ACTIVAR;
      parametros = {
        title: LS.ACCION_ACTIVAR,
        texto: LS.MSJ_PREGUNTA_ACTIVAR + "<br> " + LS.TAG_USUARIO + ": " + this.objetoSeleccionado.name,
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
          activar: estado
        }
        this.usuarioService.cambiarEstadoUsuario(parametro, this);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesCambiarEstadoUsuario(data) {
    this.objetoSeleccionado.estado = !this.objetoSeleccionado.estado;
    this.refrescarTabla(LS.ACCION_EDITAR, this.objetoSeleccionado);
    this.cargando = false;
  }

  refrescarTabla(accion, usuarioTO: UsuarioTO) {
    switch(accion) {
      case LS.ACCION_NUEVO: { // Insertar un elemento en la tabla
        let listaTemporal = [... this.listadoUsuarios];
        listaTemporal.unshift(usuarioTO);
        this.listadoUsuarios = listaTemporal;
        // this.seleccionarFila(0);
        break;
      }
      case LS.ACCION_EDITAR: { // Actualiza un elemento en la tabla
        var indexTemp = this.listadoUsuarios.findIndex(item => item.id === usuarioTO.id);
        let listaTemporal = [... this.listadoUsuarios];
        listaTemporal[indexTemp] = usuarioTO;
        this.listadoUsuarios = listaTemporal;
        this.objetoSeleccionado = this.listadoUsuarios[indexTemp];
        // this.seleccionarFila(indexTemp);
        break;
      }
      case LS.ACCION_ELIMINAR: { // Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listadoUsuarios.findIndex(item => item.id === usuarioTO.id);
        let listaTemporal = [...this.listadoUsuarios];
        listaTemporal.splice(indexTemp, 1);
        this.listadoUsuarios = listaTemporal;
        // (this.listadoUsuarios.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  enviarItem(item) {
    this.activeModal.close(item);
  }

  nuevoUsuario() {
    this.parametrosFormulario = {
      accion: LS.ACCION_NUEVO,
      isModal: false
    }
    this.vistaFormulario = true;
  }

  ejecutarAccion(data) {
    this.vistaFormulario = false;
    this.parametrosFormulario = null;
    this.refrescarTabla(data.accion, data.usuarioTO);
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

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.usuarioService.generarColumnas(this.isModal);
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
