import { Component, OnInit, ViewChild, Input, HostListener } from '@angular/core';
import { LS } from 'src/app/contantes/app-constants';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UbigeoService } from '../../configuracion/ubigeo/modal-ubigeo/ubigeo.service';
import { UtilService } from 'src/app/servicios/util/util.service';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid-community';
import { ContextMenu } from 'primeng/contextmenu';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { HabilitacionUrbana } from 'src/app/entidades/entidad.habilitacionurbana';

@Component({
  selector: 'app-ubigeos-listado',
  templateUrl: './ubigeos-listado.component.html',
  styleUrls: ['./ubigeos-listado.component.css']
})
export class UbigeosListadoComponent implements OnInit {

  @Input() edit;
  @Input() parametrosBusqueda: any = null;//parametros de busqueda
  @Input() isModal: boolean = false; // establecemos si este componente es modal o no 
  public cargando: boolean = false;
  public ubigeoBusqueda: Ubigeo = new Ubigeo();
  public listadoUbigeos: Array<Ubigeo> = []; // lista ubigeos
  public objetoSeleccionado: Ubigeo; //
  public ubigeodepartamentos: Ubigeo[];
  public departamentoSeleccionado: Ubigeo = null;
  public ubigeoprovincias: Ubigeo[] = [];
  public provinciaSeleccionado: Ubigeo = null;
  public ubigeodistritos: Ubigeo[] = [];
  public distritoSeleccionado: Ubigeo = null;
  public listaHabilitacionUrbana: HabilitacionUrbana[] = [];
  public habilitacionurbanaSelecionado: HabilitacionUrbana = null;
  public tituloListado: string;
  public tipoubigeo: number = 1;
  
  public parametrosFormulario: any = null;
  public filtroGlobal: string = "";
  public enterKey: number = 0;//Suma el numero de enter
  public vistaFormulario: boolean = false;
  public constantes: any = LS;
  public accion: string = null;

  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public localeText = {};
  public context;
  public innerWidth: number;
  public isScreamMd: boolean;//Identifica si la pantalla es tamaño MD
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  constructor(
    public activeModal: NgbActiveModal,
    private ubigeoService: UbigeoService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.localeText = { noRowsToShow: 'No se encontraron ubigeos', page: "Página", of: "de", to: "a" };
    this.tituloListado = LS.TAG_DEPARTAMENTOS_LISTADO;
    this.iniciarAgGrid();
  }

  ngOnChanges(changes) {
    console.log('change ubigeos listado');
    if (changes.parametrosBusqueda) {
      if (changes.parametrosBusqueda.currentValue) {
        this.isModal = this.parametrosBusqueda.isModal;
        if (this.parametrosBusqueda.accion == LS.ACCION_NUEVO) {
          this.nuevoUbigeo();
        } else {
          // aca son las consultas en general para listado de casas
          console.log("mostramos ubigeos...");
          const parametros = {
            tipoubigeo_id: this.departamentoSeleccionado ? this.ubigeoBusqueda.tipoubigeo_id : 0,
            codigo: this.ubigeoBusqueda.codigo,
            activos: this.parametrosBusqueda.activos
          }
          this.mostrarubigeos(parametros);
        }
      }
    }
  }

  nuevoUbigeo() {
    const parametros = {
      accion: LS.ACCION_NUEVO,
      departamentos: this.ubigeodepartamentos,
      provincias: this.ubigeoprovincias,
      distritos: this.ubigeodistritos,
      habilitacionurbanas: this.listaHabilitacionUrbana,
    }
    this.emitirAccion(parametros);
  }

  consultarUbigeo() {
    const parametros = {
      accion: LS.ACCION_CONSULTAR,
      departamentos: this.ubigeodepartamentos,
      provincias: this.ubigeoprovincias,
      distritos: this.ubigeodistritos,
      habilitacionurbanas: this.listaHabilitacionUrbana,
      ubigeo: this.objetoSeleccionado
    }
    this.emitirAccion(parametros);
  }

  editarUbigeo() {
    const parametros = {
      accion: LS.ACCION_EDITAR,
      departamentos: this.ubigeodepartamentos,
      provincias: this.ubigeoprovincias,
      distritos: this.ubigeodistritos,
      habilitacionurbanas: this.listaHabilitacionUrbana,
      ubigeo: this.objetoSeleccionado
    }
    this.emitirAccion(parametros);
  }

  listarUbigeos() {
    this.cargando = true;
    this.ubigeoService.litarUbigeos(this);
  }

  despuesDeListarUbigeos(data) {
    this.ubigeodepartamentos = data;
    this.listadoUbigeos = data;
    this.cargando = false;
    console.log(data);
  }

  mostrarprovincias(departamentoSeleccionado: Ubigeo) {
    console.log("departamentoSeleccionado: ", departamentoSeleccionado);
    if (departamentoSeleccionado) {
      this.tituloListado = LS.TAG_PROVINCIAS_LISTADO;
      this.departamentoSeleccionado = departamentoSeleccionado;
      this.ubigeoBusqueda = departamentoSeleccionado;
      this.tipoubigeo = 2;
      // this.seleccionoFila = departamentoSeleccionado.tipoubigeo_id==this.nivelTipoUbigeo - 1;
      console.log(departamentoSeleccionado);
      // mostrar ubigeos (provincias)
      const parametros = {
        tipoubigeo_id: departamentoSeleccionado.tipoubigeo_id,
        codigo: departamentoSeleccionado.codigo,
        activos: true
      }
      this.mostrarubigeos(parametros);
    } else {
      this.tituloListado = LS.TAG_DEPARTAMENTOS_LISTADO;
      this.ubigeoprovincias = [];
      this.ubigeodistritos = [];
      this.tipoubigeo = 1;
      this.listarUbigeos();
    }
  }

  mostrardistritos(provinciaSeleccionado: Ubigeo) {
    console.log("provinciaSeleccionado: ", provinciaSeleccionado);
    if (provinciaSeleccionado) {
      this.tituloListado = LS.TAG_DISTRITOS_LISTADO;
      this.provinciaSeleccionado = provinciaSeleccionado;
      this.ubigeoBusqueda = provinciaSeleccionado;
      this.tipoubigeo = 3;
      // this.seleccionoFila = provinciaSeleccionado.tipoubigeo_id==this.nivelTipoUbigeo - 1;
      console.log(provinciaSeleccionado);      
      // mostrar distritos (provincias)
      const parametros = {
        tipoubigeo_id: provinciaSeleccionado.tipoubigeo_id,
        codigo: provinciaSeleccionado.codigo,
        activos: true
      }
      this.mostrarubigeos(parametros);
    } else{
      this.tituloListado = LS.TAG_PROVINCIAS_LISTADO;
      this.ubigeodistritos = [];
      this.tipoubigeo = 2;
      this.mostrarprovincias(this.departamentoSeleccionado);
    }
  }

  mostrarHabilitacionesUrbanas(distritoSeleccionado: Ubigeo) {
    if (distritoSeleccionado) {
      this.tituloListado = LS.TAG_HABILITACIONE_URBANAS_LISTADO;
      this.distritoSeleccionado = distritoSeleccionado;
      this.ubigeoBusqueda = distritoSeleccionado;
      this.tipoubigeo = 4;
      // this.seleccionoFila = distritoSeleccionado.tipoubigeo_id==this.nivelTipoUbigeo - 1;
      console.log(distritoSeleccionado);
      // mostrar distritos (provincias)
      const parametros = {
        tipoubigeo_id: distritoSeleccionado.tipoubigeo_id,
        codigo: distritoSeleccionado.codigo,
        activos: true
      }
      this.mostrarubigeos(parametros);
    } else {
      this.tituloListado = LS.TAG_DISTRITOS_LISTADO;
      this.tipoubigeo = 3;
      this.mostrardistritos(this.provinciaSeleccionado);
    }
  }

  mostrarubigeos(parametros) {
    this.cargando = true;
    this.ubigeoService.listarubigeos(parametros, this);
  }

  despuesDeMostrarUbigeosDepartamentos(data) {
    this.cargando = false;
    this.ubigeodepartamentos = data;
    this.listadoUbigeos = this.ubigeodepartamentos;
  }

  despuesDeMostrarUbigeosProvincias(data) {
    this.cargando = false;
    this.ubigeoprovincias = data;
    this.listadoUbigeos = this.ubigeoprovincias;
  }

  despuesDeMostrarUbigeosDistritos(data) {
    this.cargando = false;
    this.ubigeodistritos = data;
    this.listadoUbigeos = data; // distritos
  }

  despuesDeMostrarUbigeosHabilitacionUrbanas(data){
    this.cargando = false;
    this.listaHabilitacionUrbana = data;
    this.listadoUbigeos = data; // distritos
  }

  imprimir() {}

  exportarUbigeos() {}

  enviarItem(item) {
    this.activeModal.close(item);
  }

  refrescarTabla(accion, ubigeo: Ubigeo) {
    switch(accion) {
      case LS.ACCION_NUEVO: { // Insertar un elemento en la tabla
        let listaTemporal = [... this.listadoUbigeos];
        listaTemporal.unshift(ubigeo);
        this.listadoUbigeos = listaTemporal;
        // this.seleccionarFila(0);
        break;
      }
      case LS.ACCION_EDITAR: { // Actualiza un elemento en la tabla
        var indexTemp = this.listadoUbigeos.findIndex(item => item.id === ubigeo.id);
        let listaTemporal = [... this.listadoUbigeos];
        listaTemporal[indexTemp] = ubigeo;
        this.listadoUbigeos = listaTemporal;
        this.objetoSeleccionado = this.listadoUbigeos[indexTemp];
        // this.seleccionarFila(indexTemp);
        break;
      }
      case LS.ACCION_ELIMINAR: { // Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listadoUbigeos.findIndex(item => item.id === ubigeo.id);
        let listaTemporal = [...this.listadoUbigeos];
        listaTemporal.splice(indexTemp, 1);
        this.listadoUbigeos = listaTemporal;
        // (this.listadoServicios.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
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
        command: () => perConsultar ? this.consultarUbigeo() : null
      },
      {
        label: LS.ACCION_EDITAR,
        icon: LS.ICON_EDITAR,
        disabled: !perModificar,
        command: () => perModificar ? this.editarUbigeo() : null
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
      // {
      //   label: LS.ACCION_ELIMINAR,
      //   icon: LS.ICON_ELIMINAR,
      //   disabled: !perEliminar,
      //   command: () => perEliminar ? this.eliminarUbigeo() : null
      // }
    ];
  }

  // aca pasa los parametros pasa a casaComponent y luego al modal casa
  emitirAccion(parametros) {
    this.accion = parametros.accion;
    this.vistaFormulario = true;
    this.parametrosFormulario = parametros;
  }

  mostrarUbigeo(parametros) {
    // para consultarUbigeo y editar en modal ubigeo
    this.vistaFormulario = true;
    this.parametrosFormulario = {
      accion: this.accion,
      parametros
    }
    // this.enviarAccion.emit(parametros);
  }

  activarServicio(estado) {
    let parametros;
    if (!estado) {
      // this.accion = LS.ACCION_INACTIVAR;
      parametros = {
        title: LS.ACCION_INACTIVAR,
        texto: LS.MSJ_PREGUNTA_INACTIVAR + "<br> " + LS.TAG_UBIGEO + ": " + this.objetoSeleccionado.ubigeo,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.LABEL_ACEPTAR,
        cancelButtonText: LS.LABEL_CANCELAR
      };
    } else {
      // this.accion = LS.ACCION_ACTIVAR;
      parametros = {
        title: LS.ACCION_ACTIVAR,
        texto: LS.MSJ_PREGUNTA_ACTIVAR + "<br> " + LS.TAG_UBIGEO + ": " + this.objetoSeleccionado.ubigeo,
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
          ubigeo: this.objetoSeleccionado.ubigeo,
          activar: estado
        }
        this.ubigeoService.cambiarEstadoUbigeo(parametro, this);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesDeCambiarEstadoUbigeo(data) {
    this.objetoSeleccionado.estado = !this.objetoSeleccionado.estado;
    this.refrescarTabla(LS.ACCION_EDITAR, this.objetoSeleccionado);
    this.cargando = false;
  }

  eliminarUbigeo() {
    // this.accion = LS.ACCION_ELIMINAR;
    let parametros = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: LS.MSJ_PREGUNTA_ELIMINAR + "<br>" + LS.TAG_UBIGEO + ": " + this.objetoSeleccionado.ubigeo,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ELIMINAR,
      cancelButtonText: LS.MSJ_CANCELAR,
      confirmButtonColor: LS.COLOR_ELIMINAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.cargando = true;
        this.ubigeoService.eliminarUbigeo(this.objetoSeleccionado.id, this);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesDeEliminarUbigeo(data) {
    this.cargando = false;
    console.log('se ha elimnado ubigeo:');
    console.log(data);
    this.refrescarTabla(LS.ACCION_ELIMINAR, this.objetoSeleccionado);
  }

  ejecutarAccionPaFormulario(data) { // oriden del formulario de personas
    const {accion, ubigeo, tipoubigeo} = data;
    switch (accion) {
      case LS.ACCION_NUEVO:
      case LS.ACCION_EDITAR:
        if (this.tipoubigeo===tipoubigeo) {
          this.refrescarTabla(accion, ubigeo);
        }
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
    this.columnDefs = this.ubigeoService.generarColumnas(this.isModal);
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
