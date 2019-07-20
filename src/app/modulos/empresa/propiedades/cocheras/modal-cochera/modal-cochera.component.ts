import { Component, OnInit, Input } from '@angular/core';
import { Cochera } from 'src/app/entidades/entidad.cochera';
import { FileItem } from 'src/app/entidades/file-item';
import { Servicios } from 'src/app/entidades/entidad.servicios';
import { Cocheraservicio } from 'src/app/entidades/entidad.cocheraservicio';
import { Foto } from 'src/app/entidades/entidad.foto';
import { Persona } from 'src/app/entidades/entidad.persona';
import { UbigeoGuardar } from 'src/app/entidades/entidad.ubigeoguardar';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CargaImagenesService } from 'src/app/servicios/carga-imagenes.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/servicios/auth.service';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { CocheraService } from '../cochera.service';
import { FotosService } from 'src/app/servicios/fotos/fotos.service';
import { LS } from 'src/app/contantes/app-constants';
import { CocheraTO } from 'src/app/entidadesTO/empresa/CocheraTO';
import { ZoomControlOptions, ControlPosition, ZoomControlStyle, FullscreenControlOptions,
  ScaleControlOptions, ScaleControlStyle, PanControlOptions } from '@agm/core/services/google-maps-types';
import { PersonasComponent } from '../../../configuracion/personas/personas.component';
import { ServiciosComponent } from '../../../configuracion/servicios/servicios.component';
import { AppAutonumeric } from 'src/app/directivas/autonumeric/AppAutonumeric';
import { CocheraArchivo } from 'src/app/entidades/entidad.cocheraarchivo';
import { UbigeoService } from '../../../configuracion/ubigeo/modal-ubigeo/ubigeo.service';
import { HabilitacionurbanaService } from '../../../configuracion/habilitacionurbana/habilitacionurbana.service';
import { UbigeoComponent } from '../../../configuracion/ubigeo/ubigeo.component';

@Component({
  selector: 'app-modal-cochera',
  templateUrl: './modal-cochera.component.html',
  styleUrls: ['./modal-cochera.component.css']
})
export class ModalCocheraComponent implements OnInit {

  @Input() parametros;
  @Input() isModal: boolean; // establecemos si este componente es modal o no 
  public verNuevo = false;
  public cargando: Boolean = false;
  public cochera: Cochera;
  public archivosFotos: FileItem[] = [];
  public archivosDocumentos: FileItem[] = [];
  public servicios: Servicios[];
  public cocheraservicios: Cocheraservicio[];
  public fotos: Foto[];
  public archivos: CocheraArchivo[];
  public persona: Persona;
  public ubigeo: UbigeoGuardar;
  public listaLP: any = []; // lista de persona-roles
  public accion: string = null;
  public tituloForm: string = null;
  public constantes: any = LS;
  public parametrosFoto: any = null;
  public configAutonumericEnteros: AppAutonumeric;
  // busqueda de ubigeos en autocomplete (habilitaciones urbanas)
  public ubigeoHU: any = []; //
  public filteridUbigeos;
  // Mapa
  public latitude: number = -5.196395;
  public longitude: number = -80.630287;
  public zoom: number = 16;
  public estaSobreElemento: any;
  
  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _cargaImagenes: CargaImagenesService,
    private cocheraService: CocheraService,
    private ubigeoService: UbigeoService,
    private habilitacionurbanaService: HabilitacionurbanaService,
    private fotosService: FotosService,
    private toastr: ToastrService,
    private auth: AuthService
  ) {
    this.configAutonumericEnteros = {
      decimalPlaces: 0,
      decimalPlacesRawValue: 0,
      decimalPlacesShownOnBlur: 0,
      decimalPlacesShownOnFocus: 0,
      maximumValue: '127',
      minimumValue: '0'
    }
  }

  ngOnInit() {
    this.cochera = new Cochera();
    this.fotos = [];
    this.archivos = [];
    this.servicios = [];
    this.cocheraservicios = [];
    this.persona = new Persona();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.archivosFotos = [];
    this.archivosDocumentos = [];
    this.listaLP = [];

    this.postInicializarModal();
  }

  ngOnChanges(changes) {
    if (changes.parametros) {
      if (changes.parametros.currentValue) {
        this.postInicializarModal();
      }
    }
  }

  postInicializarModal() {
    if (this.parametros) {
      this.accion = this.parametros.accion;
      switch (this.accion) {
        case LS.ACCION_CONSULTAR:
          this.tituloForm = LS.TITULO_FORM_CONSULTAR_COCHERA;
          this.despuesDeMostrarCochera(this.parametros.cochera);
          // this.traerParaEdicion(this.parametros.idCochera);
          break;
        case LS.ACCION_EDITAR:
          this.tituloForm = LS.TITULO_FORM_EDITAR_COCHERA;
          this.despuesDeMostrarCochera(this.parametros.cochera);
          // this.traerParaEdicion(this.parametros.idCochera);
          break;
        case LS.ACCION_NUEVO:
          if (this.isModal) {
            this.tituloForm = LS.TITULO_FORM_NUEVA_COCHERA;
            this.postGuardarCochera(this.parametros.cochera);
          } else {
            this.tituloForm = LS.TITULO_FORM_CONSULTAR_COCHERA;
          }
          break;
      }
    }
  }

  guardarcochera() {
    console.log('vamos a guardar una cochera');
    this.cochera.cocherapersonaList = this.listaLP;
    this.cochera.persona_id = this.listaLP[0]; // this.listaPR[0].idrol
    this.cochera.ubigeo_id = this.ubigeo.ubigeo;
    this.cochera.serviciosList = this.servicios;
    if (this.accion === LS.ACCION_NUEVO) { // guardar nueva cochera
      // guardar en lista fotos
      for (const item of this.archivosFotos) {
        if (item.progreso===100) {
          const foto: Foto = new Foto();
          foto.nombre = item.nombreArchivo;
          foto.foto = item.url;
          foto.detalle = item.detalle;
          this.fotos.push(foto);
        }
      }
      this.cochera.fotosList = this.fotos;
      this.fotos = [];
      console.log('fotos: ');
      console.log(this.cochera.fotosList);
      // guardar en lista documentos
      for (const item of this.archivosDocumentos) {
        if (item.progreso===100) {
          const archivo: CocheraArchivo = new CocheraArchivo();
          archivo.nombre = item.nombreArchivo;
          archivo.archivo = item.url;
          archivo.tipoarchivo = ".pdf";
          this.archivos.push(archivo);
        }
      }
      this.cochera.archivosList = this.archivos;
      this.archivos = [];
      console.log('archivos: ');
      console.log(this.cochera.archivosList);
      //
      this.cochera.ganancia = this.cochera.preciocontrato - this.cochera.precioadquisicion;
      // verificar si las fotos y archivos se subieron firebase
      if (this.cochera.fotosList.length!==this.archivosFotos.length) {
        this.toastr.warning(LS.MSJ_FALTAN_SUBIR_IMAGENES, LS.TAG_AVISO);
      } else if (this.cochera.archivosList.length!==this.archivosDocumentos.length) {
        this.toastr.warning(LS.MSJ_FALTAN_SUBIR_ARCHIVOS, LS.TAG_AVISO);
      } else { // exito
        console.log('antes de guardar cochera: ');
        console.log(this.cochera);
        this.cargando = true;
        this.cocheraService.ingresarCochera(this.cochera, this);
      }
    } else if (this.accion === LS.ACCION_EDITAR) {
      // guardar el rol editado
      // guardar en lista fotos
      let fotos: Foto[];
      fotos = [];
      for (const item of this.archivosFotos) {
        if (item.progreso===100) {
          const foto: Foto = new Foto();
          foto.nombre = item.nombreArchivo;
          foto.foto = item.url;
          foto.detalle = item.detalle;
          fotos.push(foto);
        }
      }
      this.cochera.fotosList = fotos;
      // guardar en lista archivos
      let archivos: CocheraArchivo[];
      archivos = [];
      for (const item of this.archivosDocumentos) {
        if (item.progreso===100) {
          const archivo: CocheraArchivo = new CocheraArchivo();
          archivo.nombre = item.nombreArchivo;
          archivo.archivo = item.url;
          archivos.push(archivo);
          archivo.tipoarchivo = ".pdf";
        }
      }
      this.cochera.archivosList = archivos;
      archivos = [];
      console.log('archivos: ');
      console.log(this.cochera.archivosList);
      //
      this.cochera.cocheraservicioList = this.cocheraservicios;
      fotos = [];
      console.log('fotos: ');
      console.log(this.cochera.fotosList);
      this.cochera.ganancia = this.cochera.preciocontrato - this.cochera.precioadquisicion;
      // verificar si las fotos y archivos se subieron firebase
      if (this.cochera.fotosList.length!==this.archivosFotos.length) {
        this.toastr.warning(LS.MSJ_FALTAN_SUBIR_IMAGENES, LS.TAG_AVISO);
      } else if (this.cochera.archivosList.length!==this.archivosDocumentos.length) {
        this.toastr.warning(LS.MSJ_FALTAN_SUBIR_ARCHIVOS, LS.TAG_AVISO);
      } else { // exito
        console.log('antes de editar cochera: ');
        console.log(this.cochera);
        this.cargando = true;
        this.cocheraService.modificarCochera(this.cochera, this);
      }
    }
  }

  despuesDeIngresarCochera(data) {
    console.log('se guardo estos datos: ');
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    let cocheraTO = this.convertirCocheraACocheraTO(data); // sirve para actualizar la tabla
    // luego se guarda las fotos. vale hacer eso en la sgt version
    this.activeModal.close(cocheraTO);
  }

  convertirCocheraACocheraTO(data) {
    let cocheraTO = new CocheraTO(data);
    cocheraTO.propietario = this.cochera.persona_id.nombres;
    cocheraTO.nombrehabilitacionurbana = this.cochera.ubigeo_id.ubigeo;
    cocheraTO.siglas = this.cochera.ubigeo_id.habilitacionurbana_id.siglas;
    cocheraTO.ubicacion = this.cochera.ubigeo_id.rutaubigeo;
    return cocheraTO;
  }

  despuesDeModificarCochera(data) {
    console.log('se ha modificado estos datos: ');
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    let cocheraTO = this.convertirCocheraACocheraTO(data); // sirve para actualizar la tabla
    this.activeModal.close(cocheraTO);
  }

  traerParaEdicion(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.verNuevo = true;
    this.cargando = true;
    this.cocheraService.mostrarCochera(id, this);
  }

  despuesDeMostrarCochera(data) {
    // console.log(data);
    this.cochera = data;
    this.listaLP = data.cocherapersonaList;
    this.persona = this.listaLP[0];
    this.ubigeo = data.ubigeo;
    this.ubigeoHU[0] = this.ubigeo.ubigeo;
    this.servicios = data.serviciosList;
    this.cocheraservicios = data.cocheraservicioList;
    // Mapa
    this.cochera.latitud = this.cochera.latitud ? this.cochera.latitud : this.latitude+""
    this.cochera.longitud = this.cochera.longitud ? this.cochera.longitud : this.longitude+""
    this.latitude = Number.parseFloat(this.cochera.latitud);
    this.longitude = Number.parseFloat(this.cochera.longitud);
    // End Mapa
    for (const item of data.fotosList) {
      console.log('foto: ');
      console.log(item);
      this.fotos.push(item);
    }
    console.log('fotoss : ');
    console.log(this.fotos);
    // this.fotos = res.fotosList;
    console.log('traido para edicion');
    console.log(this.cochera);
    this.cochera.fotosList = []; // tiene que ser vacio xq son la lista de imagenes nuevas pa agregarse
    // traer archivosFotos de firebase storage
    // this._cargaImagenes.getImagenes(res.path);

    // aqui metodo para mostrar todas las imagenes de este cochera ....
    // this.imagen = res.foto;
    // this.imagenAnterior = res.foto;

    // archivos documentos
    for (const item of data.archivosList) {
      console.log('archivo: ');
      console.log(item);
      this.archivos.push(item);
    }
    console.log('archivos : ');
    console.log(this.archivos);
    // this.fotos = res.fotosList;
    console.log('traido para edicion');
    console.log(this.cochera);
    this.cochera.archivosList = []; 
    this.cargando = false;
  }

  buscarpropietario() {
    const modalRef = this.modalService.open(PersonasComponent, { size: 'lg', keyboard: true });
    modalRef.componentInstance.isModal = true;
    modalRef.result.then(
      result => {
        this.persona = result;
        this.cochera.persona_id = result;
        this.listaLP[0] = result;
        this.auth.agregarmodalopenclass();
      },
      reason => {
        this.auth.agregarmodalopenclass();
      }
    );
  }

  nuevoUbigeo() {
    const modalRef = this.modalService.open(UbigeoComponent, {size: 'lg', keyboard: true});
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  buscarservicio() {
    const modalRef = this.modalService.open(ServiciosComponent, {size: 'lg', keyboard: true});
    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.in_listaServicios = this.servicios;
    modalRef.result.then((listaServicios) => {
      // agrego la listaServicios en servicios de mi componente modal-casa
      listaServicios.forEach(servicio => {
        this.servicios.push(servicio);
      });
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  postGuardarCochera(ultimaPropiedad) {
    // se genera el codigode la cochera cuando la accion es nuevo
    this.cargando = true;
    // Mapa
    this.cochera.latitud = this.cochera.latitud === "" ? this.latitude + "" : this.cochera.latitud;
    this.cochera.longitud = this.cochera.longitud === "" ? this.longitude + "" : this.cochera.longitud;
    // End Mapa
    const parametros = {
      ultimaPropiedad
    }
    this.cocheraService.generarCodigoCochera(parametros, this);
  }

  despuesDeGenerarCodigoCochera(data) {
    this.cargando = false;
    this.cochera.codigo = data;
    this.cochera.contrato = 'A';
  }

  filterUbigeoSingle(event) {
    let query = event.query;
    this.ubigeoService.buscarUbigeosHabilitacionUrbana(query.toUpperCase(), this);
  }

  despuesDeBuscarUbigeosHabilitacionUrbana(data) {
    this.filteridUbigeos = data;
  }

  isObject(): boolean {
    return (typeof this.ubigeoHU[0] === 'object');
  }

  seleccionarUbigeoEnAutocomplete(event) {
    this.habilitacionurbanaService.mostrarHabilitacionUrbana(this.ubigeoHU[0].habilitacionurbana_id, this);
    this.ubigeo.ubigeo = this.ubigeoHU[0];
    this.cochera.ubigeo_id = this.ubigeoHU[0];
    console.log("ubigeoHU: ", this.ubigeoHU[0]);
  }

  despuesDeMostrarHabilitacionUrbana(data) {
    console.log('esto trajo para editar: ', data);
    this.ubigeo.ubigeo.habilitacionurbana_id = this.ubigeoHU[0];
    this.cochera.ubigeo_id.habilitacionurbana_id = data;
  }

  // Metodos para las imagenes
  cargarImagenes() {
    let estadetalle: Boolean = true;
    for (const item of this.archivosFotos) {
      if (
        item.detalle === '' ||
        item.detalle === null ||
        item.detalle === undefined
      ) {
        // aqui falta el detalle (input type text) del archivo que obligatoriamente debe tener contenido
        estadetalle = false;
      }
    }
    if (estadetalle) {
      this.cochera.path = 'cocheras/' + this.cochera.codigo+'/fotos';
      this._cargaImagenes.cargarImagenesFirebase(this.cochera.path, this.archivosFotos);
    } else {
      this.toastr.warning(LS.MSJ_INGRESE_DETALLE_POR_IMAGEN, LS.TAG_AVISO);
    }
  }

  limpiarFotos() {
    this.archivosFotos = [];
  }

  limpiarArchivosDocumentos() {
    this.archivosDocumentos = [];
  }

  // Metodos para los archivos documentos
  cargarArchivos() {
    this.cochera.pathArchivos = 'cocheras/' + this.cochera.codigo+'/archivos';
    this._cargaImagenes.cargarImagenesFirebase(this.cochera.pathArchivos, this.archivosDocumentos);
  }

  limpiarArchivos() {
    this.archivosDocumentos = [];
  }

  limpiarcochera() {
    // limpiar persona
    this.persona = new Persona();
    this.cochera.persona_id = new Persona();
    this.cochera.ubigeo_id = new Ubigeo();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.listaLP = [];
    // limpiar foto
    this.cochera.foto = null;
    // limpiar servicios
    this.servicios = [];
    this.cocheraservicios = [];
    this.cochera.serviciosList = {};
    this.cochera.cocheraservicioList = {};
  }

  quitarservicio(servicio: Servicios) {
    const index = this.servicios.indexOf(servicio);
    this.servicios.splice(index, 1);
    // eliminamos en cocheraservicios
    let i = 0;
    for (const cocheraservicio of this.cocheraservicios) {
      if (servicio.id === cocheraservicio.servicio_id) {
        this.cocheraservicios.splice(i, 1);
      }
      i++;
    }
    // this.cocheraservicios.splice(index, 1);
    console.log('los servicios quedan: ');
    console.log(this.servicios);
    console.log('los cocheraservicios quedad');
    console.log(this.cocheraservicios);
  }

  // foto
  quitarfoto(item: FileItem) {
    if (item.progreso===100) {
      // elimino de firebase storage
      this._cargaImagenes.deleteArchivo(this.cochera.path, item.nombreArchivo);
    }
    const index = this.archivosFotos.indexOf(item);
    this.archivosFotos.splice(index, 1);
    console.log('las fotos que quedan: ');
    console.log(this.archivosFotos);
  }

  guardardetallefoto(foto: Foto) {
    console.log('salio del foco"');
    this.fotosService.ingresarDetalleFoto(foto, this);
  }

  despuesDeIngresarDetalleFoto(data) {
    console.log('se ha modificado foto:');
    console.log(data);
  }
  //
  quitarfotocochera(foto: Foto) {
    const modalRef = this.modalService.open(ConfirmacionComponent, {
      windowClass: 'nuevo-modal',
      size: 'sm',
      keyboard: false
    });
    modalRef.result.then(
      result => {
        // elimino de la bd
        this.eliminarfotocochera(foto);
        // elimino de firebase storage
        this._cargaImagenes.deleteArchivo(this.cochera.path, foto.nombre);
        if (this.cochera.foto === foto.foto) {
          this.cochera.foto = null;
        }
        this.auth.agregarmodalopenclass();
      },
      reason => {
        this.auth.agregarmodalopenclass();
      }
    );
  }

  eliminarfotocochera(foto: Foto) {
    this.cocheraService.eliminarFotoCochera(foto, this);
  }

  despuesDeEliminarFotoCochera(data) {
    console.log('se ha eliminado:');
    console.log(data);
  }

  mostrarFotoPrincipal(item: FileItem) {
    if (item.progreso >= 100) {
      this.cochera.foto = item.url;
    }
  }

  mostrarFotoPrincipalExistente(foto: Foto) {
    this.cochera.foto = foto.foto;
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

  // se selecciona la imagen y los muestra en el panel
  onSelectImagenes(event) {
    for(let file of event.files) {
      this.archivosFotos.push(new FileItem(file));
    }
  }

  // archivos documentos
  quitararchivo(item: FileItem) {
    if (item.progreso===100) {
      // elimino de firebase storage
      this._cargaImagenes.deleteArchivo(this.cochera.pathArchivos, item.nombreArchivo);
    }
    const index = this.archivosDocumentos.indexOf(item);
    this.archivosDocumentos.splice(index, 1);
    console.log('los archivos que quedan: ');
    console.log(this.archivosDocumentos);
  }

  quitararchivocochera(archivo: CocheraArchivo) {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      // elimino de la bd
      this.eliminararchivocochera(archivo);
      // elimino de firebase storage
      this._cargaImagenes.deleteArchivo(this.cochera.pathArchivos, archivo.nombre);
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  eliminararchivocochera(archivo: CocheraArchivo) {
    this.cocheraService.eliminarArchivoCochera(archivo, this);
  }

  despuesDeEliminarArchivoCochera(data) {
    console.log('se ha eliminado:');
    console.log(data);
  }

  // se selecciona la imagen y los muestra en el panel
  onSelectArchivos(event) {
    console.log("event.files",event.files);
    for(let file of event.files) {
      this.archivosDocumentos.push(new FileItem(file));
    }
  }

  // Mapa
  zoomControlOptions: ZoomControlOptions = {
    position: ControlPosition.RIGHT_BOTTOM,
    style: ZoomControlStyle.LARGE
  };

  fullscreenControlOptions: FullscreenControlOptions = {
    position : ControlPosition.TOP_RIGHT
  };

  // mapTypeControlOptions: MapTypeControlOptions = {
  //   mapTypeIds: [ MapTypeId.ROADMAP],
  //   position: ControlPosition.BOTTOM_LEFT,
  // };

  scaleControlOptions: ScaleControlOptions = {
    style: ScaleControlStyle.DEFAULT
  }

  panControlOptions: PanControlOptions = {
    position: ControlPosition.LEFT_TOP,
  }

  markerDragEnd($event) { // MouseEvent
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.cochera.latitud = this.latitude + "";
    this.cochera.longitud = this.longitude + "";
  }
  // End Mapa
}
