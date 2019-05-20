import { Component, OnInit, Input } from '@angular/core';
import { Local } from 'src/app/entidades/entidad.local';
import { FileItem } from 'src/app/entidades/file-item';
import { Servicios } from 'src/app/entidades/entidad.servicios';
import { Localservicio } from 'src/app/entidades/entidad.localservicio';
import { Foto } from 'src/app/entidades/entidad.foto';
import { Persona } from 'src/app/entidades/entidad.persona';
import { UbigeoGuardar } from 'src/app/entidades/entidad.ubigeoguardar';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CargaImagenesService } from 'src/app/servicios/carga-imagenes.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/servicios/auth.service';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { ModalUbigeoComponent } from '../../../configuracion/ubigeo/modal-ubigeo/modal-ubigeo.component';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { LocalService } from '../local.service';
import { FotosService } from 'src/app/servicios/fotos/fotos.service';
import { LS } from 'src/app/contantes/app-constants';
import { LocalTO } from 'src/app/entidadesTO/empresa/LocalTO';
import { ZoomControlOptions, ControlPosition, ZoomControlStyle, FullscreenControlOptions, 
  ScaleControlOptions, ScaleControlStyle, PanControlOptions } from '@agm/core/services/google-maps-types';
import { PersonasComponent } from '../../../configuracion/personas/personas.component';
import { ServiciosComponent } from '../../../configuracion/servicios/servicios.component';
import { AppAutonumeric } from 'src/app/directivas/autonumeric/AppAutonumeric';
import { LocalArchivo } from 'src/app/entidades/entidad.localarchivo';

@Component({
  selector: 'app-modal-local',
  templateUrl: './modal-local.component.html',
  styleUrls: ['./modal-local.component.css']
})
export class ModalLocalComponent implements OnInit {

  @Input() parametros;
  @Input() isModal: boolean; // establecemos si este componente es modal o no 
  public verNuevo = false;
  public cargando: Boolean = false;
  public local: Local;
  public archivosFotos: FileItem[] = [];
  public archivosDocumentos: FileItem[] = [];
  public servicios: Servicios[];
  public localservicios: Localservicio[];
  public fotos: Foto[];
  public archivos: LocalArchivo[];
  public persona: Persona;
  public ubigeo: UbigeoGuardar;
  public listaLP: any = []; // lista de persona-roles
  public accion: string = null;
  public tituloForm: string = null;
  public constantes: any = LS;
  public parametrosFoto: any = null;
  public estaSobreElemento: any;
  public configAutonumericEnteros: AppAutonumeric;
  // Mapa
  public latitude: number = -5.196395;
  public longitude: number = -80.630287;
  public zoom: number = 16;

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private localService: LocalService,
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
    this.local = new Local();
    this.fotos = [];
    this.archivos = [];
    this.servicios = [];
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
          this.tituloForm = LS.TITULO_FORM_CONSULTAR_LOCAL;
          this.despuesDeMostrarLocal(this.parametros.local);
          // this.traerParaEdicion(this.parametros.idCochera);
          break;
        case LS.ACCION_EDITAR:
          this.tituloForm = LS.TITULO_FORM_EDITAR_LOCAL;
          this.despuesDeMostrarLocal(this.parametros.local);
          // this.traerParaEdicion(this.parametros.idCochera);
          break;
        case LS.ACCION_NUEVO:
          if (this.isModal) {
            this.tituloForm = LS.TITULO_FORM_NUEVO_LOCAL;
            this.postGuardarLocal();
          } else {
            this.tituloForm = LS.TITULO_FORM_CONSULTAR_LOCAL;
          }
          break;
      }
    }
  }

  guardarLocal() {
    console.log('vamos a guardar un local');
    this.cargando = true;
    this.local.localpersonaList = this.listaLP;
    this.local.persona_id = this.listaLP[0]; // this.listaPR[0].idrol
    this.local.ubigeo_id = this.ubigeo.ubigeo;
    this.local.serviciosList = this.servicios;
    if (this.accion === LS.ACCION_NUEVO) { // guardar nueva local
      // guardar en lista fotos
      for (const item of this.archivosFotos) {
        const foto: Foto = new Foto();
        foto.nombre = item.nombreArchivo;
        foto.foto = item.url;
        foto.detalle = item.detalle;
        this.fotos.push(foto);
      }
      this.local.fotosList = this.fotos;
      this.fotos = [];
      console.log('fotos: ');
      console.log(this.local.fotosList);
      // guardar en lista documentos
      for (const item of this.archivosDocumentos) {
        const archivo: LocalArchivo = new LocalArchivo();
        archivo.nombre = item.nombreArchivo;
        archivo.archivo = item.url;
        archivo.tipoarchivo = ".pdf";
        this.archivos.push(archivo);
      }
      this.local.archivosList = this.archivos;
      this.archivos = [];
      console.log('archivos: ');
      console.log(this.local.archivosList);
      //
      this.local.ganancia = this.local.preciocontrato - this.local.precioadquisicion;
      console.log('antes de guardar local: ');
      console.log(this.local);
      this.localService.ingresarLocal(this.local, this);
    } else if (this.accion === LS.ACCION_EDITAR) { // guardar el rol editado
      // guardar en lista fotos
      let fotos: Foto[];
      fotos = [];
      for (const item of this.archivosFotos) {
        const foto: Foto = new Foto();
        foto.nombre = item.nombreArchivo;
        foto.foto = item.url;
        foto.detalle = item.detalle;
        fotos.push(foto);
      }
      this.local.fotosList = fotos;
      this.local.localservicioList = this.localservicios;
      fotos = [];
      console.log('fotos: ');
      console.log(this.local.fotosList);
      // guardar en lista archivos
      let archivos: LocalArchivo[];
      archivos = [];
      for (const item of this.archivosDocumentos) {
        const archivo: LocalArchivo = new LocalArchivo();
        archivo.nombre = item.nombreArchivo;
        archivo.archivo = item.url;
        archivos.push(archivo);
        archivo.tipoarchivo = ".pdf";
      }
      this.local.archivosList = archivos;
      archivos = [];
      console.log('archivos: ');
      console.log(this.local.archivosList);
      //
      this.local.ganancia = this.local.preciocontrato - this.local.precioadquisicion;
      console.log('antes de editar local: ');
      console.log(this.local);
      this.localService.modificarLocal(this.local, this);
    }
  }

  despuesDeIngresarLocal(data) {
    console.log('se guardo estos datos: ');
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    let localTO = this.convertirLocalALocalTO(data); // sirve para actualizar la tabla
    // luego se guarda las fotos. vale hacer eso en la sgt version
    this.activeModal.close(localTO);
  }

  convertirLocalALocalTO(data) {
    let localTO = new LocalTO(data);
    localTO.propietario = this.local.persona_id.nombres;
    localTO.nombrehabilitacionurbana = this.local.ubigeo_id.ubigeo;
    return localTO;
  }

  despuesDeModificarLocal(data) {
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    let cocheraTO = this.convertirLocalALocalTO(data); // sirve para actualizar la tabla
    this.activeModal.close(cocheraTO);
  }
  traerParaEdicion(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.verNuevo = true;
    this.cargando = true;
    this.localService.mostrarLocal(id, this);
  }

  despuesDeMostrarLocal(data) {
    // console.log(res);
    this.local = data;
    this.listaLP = data.localpersonaList;
    this.persona = this.listaLP[0];
    this.ubigeo = data.ubigeo;
    this.servicios = data.serviciosList;
    this.localservicios = data.localservicioList;
    // Mapa
    this.local.latitud = this.local.latitud ? this.local.latitud : this.latitude+""
    this.local.longitud = this.local.longitud ? this.local.longitud : this.longitude+""
    this.latitude = Number.parseFloat(this.local.latitud);
    this.longitude = Number.parseFloat(this.local.longitud);
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
    console.log(this.local);
    this.local.fotosList = {}; // tiene que ser vacio xq son la lista de imagenes nuevas pa agregarse
    // traer archivosFotos de firebase storage
    // this._cargaImagenes.getImagenes(res.path);

    // aqui metodo para mostrar todas las imagenes de este local ....
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
    console.log(this.local);
    this.local.archivosList = {}; 
    this.cargando = false;
  }

  buscarpropietario() {
    const modalRef = this.modalService.open(PersonasComponent, {size: 'lg', keyboard: true});
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((result) => {
      this.persona = result;
      this.local.persona_id = result;
      this.listaLP[0] = result;
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  buscarubigeo() {
    const modalRef = this.modalService.open(ModalUbigeoComponent, {size: 'lg', keyboard: true});
    modalRef.componentInstance.nivelTipoUbigeo = 4;
    // 4 es habilitacion urbana (que me retorne un habilitacion urbana)
    modalRef.result.then((result) => {
      console.log('ubigeoguardar:');
      console.log(result);
      this.ubigeo = result;
      this.local.ubigeo_id = result.ubigeo;
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  buscarservicio() {
    const modalRef = this.modalService.open(ServiciosComponent, {size: 'lg', keyboard: true});
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((result) => {
      const servicio = this.servicios.find(item => item.id === result.id);
      if (servicio) {
        this.toastr.warning(LS.MSJ_SERVICIO_YA_SE_HA_ASIGNADO, LS.TAG_AVISO);
      } else {
        this.servicios.push(result);
      }
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  postGuardarLocal() {
    // se genera el codigode la cochera cuando la accion es nuevo
    this.cargando = true;
    // Mapa
    this.local.latitud = this.local.latitud === "" ? this.latitude + "" : this.local.latitud;
    this.local.longitud = this.local.longitud === "" ? this.longitude + "" : this.local.longitud;
    // End Mapa
    this.localService.generarCodigoLocal(this);
  }

  despuesDeGenerarCodigoLocal(data) {
    this.cargando = false;
    this.local.codigo = data;
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
      this.local.path = 'locales/' + this.persona.dni;
      this._cargaImagenes.cargarImagenesFirebase(this.local.path, this.archivosFotos);
    } else {
      this.toastr.warning(LS.MSJ_INGRESE_DETALLE_POR_IMAGEN, LS.TAG_AVISO);
    }
  }

  limpiarFotos() {
    this.archivosFotos = [];
  }

  // Metodos para los archivos documentos
  cargarArchivos() {
    this.local.pathArchivos = 'locales/' + this.local.codigo+'/archivos';
    this._cargaImagenes.cargarImagenesFirebase(this.local.pathArchivos, this.archivosDocumentos);
  }

  limpiarArchivos() {
    this.archivosDocumentos = [];
  }

  limpiarlocal() {
    // limpiar persona
    this.persona = new Persona();
    this.local.persona_id = new Persona();
    this.local.ubigeo_id = new Ubigeo();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.listaLP = [];
    // limpiar foto
    this.local.foto = null;
    // limpiar servicios
    this.servicios = [];
    this.localservicios = [];
    this.local.serviciosList = {};
    this.local.localservicioList = {};
  }

  quitarservicio(servicio: Servicios) {
    const index = this.servicios.indexOf(servicio);
    this.servicios.splice(index, 1);
    // eliminamos en localservicios
    let i = 0;
    for (const localservicio of this.localservicios) {
      if (servicio.id === localservicio.servicio_id) {
        this.localservicios.splice(i, 1);
      }
      i++;
    }
    // this.localservicios.splice(index, 1);
    console.log('los servicios quedan: ');
    console.log(this.servicios);
    console.log('los localservicios quedad');
    console.log(this.localservicios);
  }

  // foto
  quitarfoto(item: FileItem) {
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
  quitarfotolocal(foto: Foto) {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      // elimino de la bd
      this.eliminarfotolocal(foto);
      // elimino de firebase storage
      this._cargaImagenes.deleteArchivo(this.local.path, foto.nombre);
      if (this.local.foto === foto.foto) {
        this.local.foto = null;
      }
      this.toastr.success(result.operacionMensaje, 'Exito');
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  eliminarfotolocal(foto: Foto) {
    this.localService.eliminarFotoLocal(foto, this);
  }

  despuesDeEliminarFotoLocal(data) {
    console.log('se ha eliminado:');
    console.log(data);
  }
  mostrarFotoPrincipal(item: FileItem) {
    if (item.progreso >= 100 ) {
      this.local.foto = item.url;
    }
  }

  mostrarFotoPrincipalExistente(foto: Foto) {
    this.local.foto = foto.foto;
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
    const index = this.archivosDocumentos.indexOf(item);
    this.archivosDocumentos.splice(index, 1);
    console.log('los archivos que quedan: ');
    console.log(this.archivosDocumentos);
  }

  quitararchivolocal(archivo: LocalArchivo) {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      // elimino de la bd
      this.eliminararchivolocal(archivo);
      // elimino de firebase storage
      this._cargaImagenes.deleteArchivo(this.local.pathArchivos, archivo.nombre);
      this.toastr.success(result.operacionMensaje, 'Exito');
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  eliminararchivolocal(archivo: LocalArchivo) {
    this.localService.eliminarArchivoLocal(archivo, this);
  }

  despuesDeEliminarArchivoLocal(data) {
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
    this.local.latitud = this.latitude + "";
    this.local.longitud = this.longitude + "";
  }
  // End Mapa
}
