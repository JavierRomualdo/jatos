import { Component, OnInit, Input } from '@angular/core';
import { Habitacion } from 'src/app/entidades/entidad.habitacion';
import { FileItem } from 'src/app/entidades/file-item';
import { Servicios } from 'src/app/entidades/entidad.servicios';
import { Habitacionservicio } from 'src/app/entidades/entidad.habitacionservicio';
import { Foto } from 'src/app/entidades/entidad.foto';
import { Persona } from 'src/app/entidades/entidad.persona';
import { UbigeoGuardar } from 'src/app/entidades/entidad.ubigeoguardar';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CargaImagenesService } from 'src/app/servicios/carga-imagenes.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/servicios/auth.service';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { HabitacionService } from '../habitacion.service';
import { FotosService } from 'src/app/servicios/fotos/fotos.service';
import { LS } from 'src/app/contantes/app-constants';
import { HabitacionTO } from 'src/app/entidadesTO/empresa/HabitacionTO';
import { ZoomControlOptions, ControlPosition, ZoomControlStyle, FullscreenControlOptions, 
  ScaleControlOptions, ScaleControlStyle, PanControlOptions } from '@agm/core/services/google-maps-types';
import { PersonasComponent } from '../../../configuracion/personas/personas.component';
import { ServiciosComponent } from '../../../configuracion/servicios/servicios.component';
import { AppAutonumeric } from 'src/app/directivas/autonumeric/AppAutonumeric';
import { HabitacionArchivo } from 'src/app/entidades/entidad.habitacionarchivo';
import { UbigeoService } from '../../../configuracion/ubigeo/modal-ubigeo/ubigeo.service';
import { HabilitacionurbanaService } from '../../../configuracion/habilitacionurbana/habilitacionurbana.service';
import { UbigeoComponent } from '../../../configuracion/ubigeo/ubigeo.component';

@Component({
  selector: 'app-modal-habitacion',
  templateUrl: './modal-habitacion.component.html',
  styleUrls: ['./modal-habitacion.component.css']
})
export class ModalHabitacionComponent implements OnInit {

  @Input() parametros;
  @Input() isModal: boolean; // establecemos si este componente es modal o no 
  public verNuevo = false;
  public cargando: Boolean = false;
  public habitacion: Habitacion;
  public archivosFotos: FileItem[] = [];
  public archivosDocumentos: FileItem[] = [];
  public servicios: Servicios[];
  public habitacionservicios: Habitacionservicio[];
  public fotos: Foto[];
  public archivos: HabitacionArchivo[];
  public persona: Persona;
  public ubigeo: UbigeoGuardar;
  public listaLP: any = []; // lista de persona-roles
  public accion: string = null;
  public tituloForm: string = null;
  public constantes: any = LS;
  public parametrosFoto: any = null;
  public estaSobreElemento: any;
  public configAutonumericEnteros: AppAutonumeric;
  // busqueda de ubigeos en autocomplete (habilitaciones urbanas)
  public ubigeoHU: any = []; //
  public filteridUbigeos;
  // Mapa
  public latitude: number = -5.196395;
  public longitude: number = -80.630287;
  public zoom: number = 16;

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private habitacionService: HabitacionService,
    private ubigeoService: UbigeoService,
    private habilitacionurbanaService: HabilitacionurbanaService,
    private fotosService: FotosService,
    private _cargaImagenes: CargaImagenesService,
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
    this.habitacion = new Habitacion();
    this.fotos = [];
    this.archivos = [];
    this.servicios = [];
    this.habitacionservicios = [];
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
          this.tituloForm = LS.TITULO_FORM_CONSULTAR_HABITACION;
          this.despuesDeMostrarHabitacion(this.parametros.habitacion);
          // this.traerParaEdicion(this.parametros.idHabitacion);
          break;
        case LS.ACCION_EDITAR:
          this.tituloForm = LS.TITULO_FORM_EDITAR_HABITACION;
          this.despuesDeMostrarHabitacion(this.parametros.habitacion);
          // this.traerParaEdicion(this.parametros.idHabitacion);
          break;
        case LS.ACCION_NUEVO:
          if (this.isModal) {
            this.tituloForm = LS.TITULO_FORM_NUEVA_HABITACION;
            this.postGuardarHabitacion(this.parametros.habitacion);
          } else {
            this.tituloForm = LS.TITULO_FORM_CONSULTAR_HABITACION;
            this.accion = LS.ACCION_CONSULTAR;
          }
          break;
      }
    }
  }

  guardarHabitacion() {
    console.log('vamos a guardar una habitacion');
    this.habitacion.habitacionpersonaList = this.listaLP;
    this.habitacion.persona_id = this.listaLP[0]; // this.listaPR[0].idrol
    this.habitacion.ubigeo_id = this.ubigeo.ubigeo;
    this.habitacion.serviciosList = this.servicios;
    if (this.accion === LS.ACCION_NUEVO) { // guardar nueva habitacion
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
      this.habitacion.fotosList = this.fotos;
      this.fotos = [];
      console.log('fotos: ');
      console.log(this.habitacion.fotosList);
      // guardar en lista documentos
      for (const item of this.archivosDocumentos) {
        if (item.progreso===100) {
          const archivo: HabitacionArchivo = new HabitacionArchivo();
          archivo.nombre = item.nombreArchivo;
          archivo.archivo = item.url;
          archivo.tipoarchivo = ".pdf";
          this.archivos.push(archivo);
        }
      }
      this.habitacion.archivosList = this.archivos;
      this.archivos = [];
      console.log('archivos: ');
      console.log(this.habitacion.archivosList);
      //
      this.habitacion.ganancia = this.habitacion.preciocontrato - this.habitacion.precioadquisicion;
      // verificar si las fotos y archivos se subieron firebase
      if (this.habitacion.fotosList.length!==this.archivosFotos.length) {
        this.toastr.warning(LS.MSJ_FALTAN_SUBIR_IMAGENES, LS.TAG_AVISO);
      } else if (this.habitacion.archivosList.length!==this.archivosDocumentos.length) {
        this.toastr.warning(LS.MSJ_FALTAN_SUBIR_ARCHIVOS, LS.TAG_AVISO);
      } else { // exito
        console.log('antes de guardar habitacion: ');
        console.log(this.habitacion);
        this.cargando = true;
        this.habitacionService.ingresarHabitacion(this.habitacion, this);
      }
    } else if (this.accion === LS.ACCION_EDITAR) { // guardar el rol editado
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
      this.habitacion.fotosList = fotos;
      this.habitacion.habitacionservicioList = this.habitacionservicios;
      fotos = [];
      console.log('fotos: ');
      console.log(this.habitacion.fotosList);
      // guardar en lista archivos
      let archivos: HabitacionArchivo[];
      archivos = [];
      for (const item of this.archivosDocumentos) {
        if (item.progreso===100) {
          const archivo: HabitacionArchivo = new HabitacionArchivo();
          archivo.nombre = item.nombreArchivo;
          archivo.archivo = item.url;
          archivos.push(archivo);
          archivo.tipoarchivo = ".pdf";
        }
      }
      this.habitacion.archivosList = archivos;
      archivos = [];
      console.log('archivos: ');
      console.log(this.habitacion.archivosList);
      //
      this.habitacion.ganancia = this.habitacion.preciocontrato - this.habitacion.precioadquisicion;
      // verificar si las fotos y archivos se subieron firebase
      if (this.habitacion.fotosList.length!==this.archivosFotos.length) {
        this.toastr.warning(LS.MSJ_FALTAN_SUBIR_IMAGENES, LS.TAG_AVISO);
      } else if (this.habitacion.archivosList.length!==this.archivosDocumentos.length) {
        this.toastr.warning(LS.MSJ_FALTAN_SUBIR_ARCHIVOS, LS.TAG_AVISO);
      } else { // exito
        console.log('antes de editar habitacion: ');
        console.log(this.habitacion);
        this.cargando = true;
        this.habitacionService.modificarHabitacion(this.habitacion, this);
      }
    }
  }

  despuesDeIngresarHabitacion(data) {
    console.log('se guardo estos datos: ');
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    let habitacionTO = this.convertirHabitacionAHabitacionTO(data); // sirve para actualizar la tabla
    // luego se guarda las fotos. vale hacer eso en la sgt version
    this.activeModal.close(habitacionTO);
  }

  convertirHabitacionAHabitacionTO(data) {
    let habitacionTO = new HabitacionTO(data);
    habitacionTO.propietario = this.habitacion.persona_id.nombres;
    habitacionTO.nombrehabilitacionurbana = this.habitacion.ubigeo_id.ubigeo;
    habitacionTO.siglas = this.habitacion.ubigeo_id.habilitacionurbana_id.siglas;
    habitacionTO.ubicacion = this.habitacion.ubigeo_id.rutaubigeo;
    return habitacionTO;
  }

  despuesDeModificarHabitacion(data) {
    console.log('se ha modificado estos datos: ');
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    let habitacionTO = this.convertirHabitacionAHabitacionTO(data); // sirve para actualizar la tabla
    // luego se guarda las fotos. vale hacer eso en la sgt version
    this.activeModal.close(habitacionTO);
  }

  traerParaEdicion(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.verNuevo = true;
    this.cargando = true;
    this.habitacionService.mostrarHabitacion(id, this);
  }

  despuesDeMostrarHabitacion(data) {
    // console.log(res);
    this.habitacion = data;
    this.listaLP = data.habitacionpersonaList;
    this.persona = this.listaLP[0];
    this.ubigeo = data.ubigeo;
    this.ubigeoHU[0] = this.ubigeo.ubigeo;
    this.servicios = data.serviciosList;
    this.habitacionservicios = data.habitacionservicioList;
    // Mapa
    this.habitacion.latitud = this.habitacion.latitud ? this.habitacion.latitud : this.latitude+""
    this.habitacion.longitud = this.habitacion.longitud ? this.habitacion.longitud : this.longitude+""
    this.latitude = Number.parseFloat(this.habitacion.latitud);
    this.longitude = Number.parseFloat(this.habitacion.longitud);
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
    console.log(this.habitacion);
    this.habitacion.fotosList = []; // tiene que ser vacio xq son la lista de imagenes nuevas pa agregarse
    // traer archivosFotos de firebase storage
    // this._cargaImagenes.getImagenes(res.path);

    // aqui metodo para mostrar todas las imagenes de este propiedad ....
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
    console.log(this.habitacion);
    this.habitacion.archivosList = []; 
    this.cargando = false;
  }

  buscarpropietario() {
    const modalRef = this.modalService.open(PersonasComponent, {size: 'lg', keyboard: true});
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((result) => {
      this.persona = result;
      this.habitacion.persona_id = result;
      this.listaLP[0] = result;
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
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

  postGuardarHabitacion(ultimaPropiedad) {
    // se genera el codigode la habitacion cuando la accion es nuevo
    this.cargando = true;
    // Mapa
    this.habitacion.latitud = this.habitacion.latitud === "" ? this.latitude + "" : this.habitacion.latitud;
    this.habitacion.longitud = this.habitacion.longitud === "" ? this.longitude + "" : this.habitacion.longitud;
    // End Mapa
    const parametros = {
      ultimaPropiedad
    }
    this.habitacionService.generarCodigoHabitacion(parametros, this);
  }

  despuesDeGenerarCodigoHabitacion(data) {
    this.cargando = false;
    this.habitacion.codigo = data;
    this.habitacion.contrato = "A";
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
    this.habitacion.ubigeo_id = this.ubigeoHU[0];
    console.log("ubigeoHU: ", this.ubigeoHU[0]);
  }

  despuesDeMostrarHabilitacionUrbana(data) {
    console.log('esto trajo para editar: ', data);
    this.ubigeo.ubigeo.habilitacionurbana_id = this.ubigeoHU[0];
    this.habitacion.ubigeo_id.habilitacionurbana_id = data;
  }

  // Metodos para las imagenes
  cargarImagenes() {
    let estadetalle: Boolean = true;
    for (const item of this.archivosFotos) {
      if (item.detalle === '' || item.detalle === null || item.detalle === undefined) {
        // aqui falta el detalle (input type text) del archivo que obligatoriamente debe tener contenido
        estadetalle = false;
      }
    }
    if (estadetalle) {
      this.habitacion.path = 'habitaciones/' + this.habitacion.codigo+'/fotos';
      this._cargaImagenes.cargarImagenesFirebase(this.habitacion.path, this.archivosFotos);
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
    this.habitacion.pathArchivos = 'habitaciones/' + this.habitacion.codigo+'/archivos';
    this._cargaImagenes.cargarImagenesFirebase(this.habitacion.pathArchivos, this.archivosDocumentos);
  }

  limpiarArchivos() {
    this.archivosDocumentos = [];
  }

  limpiarhabitacion() {
    // limpiar persona
    this.persona = new Persona();
    this.habitacion.persona_id = new Persona();
    this.habitacion.ubigeo_id = new Ubigeo();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.listaLP = [];
    // limpiar foto
    this.habitacion.foto = null;
    // limpiar servicios
    this.servicios = [];
    this.habitacionservicios = [];
    this.habitacion.serviciosList = {};
    this.habitacion.habitacionservicioList = {};
  }

  quitarservicio(servicio: Servicios) {
    const index = this.servicios.indexOf(servicio);
    this.servicios.splice(index, 1);
    // eliminamos en habitacionservicios
    let i = 0;
    for (const habitacionservicio of this.habitacionservicios) {
      if (servicio.id === habitacionservicio.servicio_id) {
        this.habitacionservicios.splice(i, 1);
      }
      i++;
    }
    // this.habitacionservicios.splice(index, 1);
    console.log('los habitacionservicios quedan: ');
    console.log(this.servicios);
    console.log('los habitacionservicios quedad');
    console.log(this.habitacionservicios);
  }

  // foto
  quitarfoto(item: FileItem) {
    if (item.progreso===100) {
      // elimino de firebase storage
      this._cargaImagenes.deleteArchivo(this.habitacion.path, item.nombreArchivo);
    }
    const index = this.archivosFotos.indexOf(item);
    this.archivosFotos.splice(index, 1);
    console.log('las fotos que quedan: ');
    console.log(this.archivosFotos);
  }

  guardardetallefoto(foto: Foto) {
    console.log('salio del foco');
    this.fotosService.ingresarDetalleFoto(foto, this);
  }

  despuesDeIngresarDetalleFoto(data) {
    console.log('se ha modificado foto:');
    console.log(data);
  }

  //
  quitarfotohabitacion(foto: Foto) {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      // elimino de la bd
      this.eliminarfotohabitacion(foto);
      // elimino de firebase storage
      this._cargaImagenes.deleteArchivo(this.habitacion.path, foto.nombre);
      if (this.habitacion.foto === foto.foto) {
        this.habitacion.foto = null;
      }
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  eliminarfotohabitacion(foto: Foto) {
    this.habitacionService.eliminarFotoHabitacion(foto, this);
  }

  despuesDeEliminarFotoHabitacion(data) {
    console.log('se ha eliminado:');
    console.log(data);
  }

  mostrarFotoPrincipal(item: FileItem) {
    if (item.progreso >= 100 ) {
      this.habitacion.foto = item.url;
    }
  }

  mostrarFotoPrincipalExistente(foto: Foto) {
    this.habitacion.foto = foto.foto;
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
      this._cargaImagenes.deleteArchivo(this.habitacion.pathArchivos, item.nombreArchivo);
    }
    const index = this.archivosDocumentos.indexOf(item);
    this.archivosDocumentos.splice(index, 1);
    console.log('los archivos que quedan: ');
    console.log(this.archivosDocumentos);
  }

  quitararchivohabitacion(archivo: HabitacionArchivo) {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      // elimino de la bd
      this.eliminararchivohabitacion(archivo);
      // elimino de firebase storage
      this._cargaImagenes.deleteArchivo(this.habitacion.pathArchivos, archivo.nombre);
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  eliminararchivohabitacion(archivo: HabitacionArchivo) {
    this.habitacionService.eliminarArchivoHabitacion(archivo, this);
  }

  despuesDeEliminarArchivoHabitacion(data) {
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
    this.habitacion.latitud = this.latitude + "";
    this.habitacion.longitud = this.longitude + "";
  }
  // End Mapa
}
