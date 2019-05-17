import { Component, OnInit, Input } from '@angular/core';
import { Casa } from 'src/app/entidades/entidad.casa';
import { FileItem } from 'src/app/entidades/file-item';
import { Servicios } from 'src/app/entidades/entidad.servicios';
import { Casaservicio } from 'src/app/entidades/entidad.casaservicio';
import { Foto } from 'src/app/entidades/entidad.foto';
import { Persona } from 'src/app/entidades/entidad.persona';
import { UbigeoGuardar } from 'src/app/entidades/entidad.ubigeoguardar';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CargaImagenesService } from 'src/app/servicios/carga-imagenes.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/servicios/auth.service';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { ModalUbigeoComponent } from '../../../configuracion/ubigeo/modal-ubigeo/modal-ubigeo.component';
import { CasasService } from '../casas.service';
import { FotosService } from 'src/app/servicios/fotos/fotos.service';
import { LS } from 'src/app/contantes/app-constants';
import { CasaTO } from 'src/app/entidadesTO/empresa/CasaTO';
import { ZoomControlOptions, ControlPosition, ZoomControlStyle, FullscreenControlOptions,
  ScaleControlOptions, ScaleControlStyle, PanControlOptions } from '@agm/core/services/google-maps-types';
import { PersonasComponent } from '../../../configuracion/personas/personas.component';
import { ServiciosComponent } from '../../../configuracion/servicios/servicios.component';
import { AppAutonumeric } from 'src/app/directivas/autonumeric/AppAutonumeric';
import { CasaArchivo } from 'src/app/entidades/entidad.casaarchivo';

@Component({
  selector: 'app-modal-casa',
  templateUrl: './modal-casa.component.html',
  styleUrls: ['./modal-casa.component.css']
})
export class ModalCasaComponent implements OnInit {

  @Input() parametros;
  @Input() isModal: boolean; // establecemos si este componente es modal o no 
  public verNuevo = false;
  public cargando: Boolean = false;
  public casa: Casa;
  public archivosFotos: FileItem[] = [];
  public archivosDocumentos: FileItem[] = [];
  public servicios: Servicios[];
  public casaservicios: Casaservicio[];
  public fotos: Foto[];
  public archivos: CasaArchivo[];
  public persona: Persona;
  public ubigeo: UbigeoGuardar;
  public listaLP: any = []; // lista de persona-roles
  public accion: string = null;
  public tituloForm: string = null;
  public constantes: any = LS;
  public parametrosFoto: any = null;
  public configAutonumericEnteros: AppAutonumeric;
  // Mapa
  public latitude: number = -5.196395;
  public longitude: number = -80.630287;
  public zoom: number = 16;
  public estaSobreElemento: any;

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _cargaImagenes: CargaImagenesService,
    private casasService: CasasService,
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
    // limpiar
    this.casa = new Casa();
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
          this.tituloForm = LS.TITULO_FORM_CONSULTAR_CASA;
          this.despuesDeMostrarCasa(this.parametros.casa);
          // this.traerParaEdicion(this.parametros.idCasa);
          break;
        case LS.ACCION_EDITAR:
          this.tituloForm = LS.TITULO_FORM_EDITAR_CASA;
          this.despuesDeMostrarCasa(this.parametros.casa);
          // this.traerParaEdicion(this.parametros.idCasa);
          break;
        case LS.ACCION_NUEVO:
          if (this.isModal) {
            this.tituloForm = LS.TITULO_FORM_NUEVA_CASA;
            this.postGuardarCasa();
          } else {
            this.tituloForm = LS.TITULO_FORM_CONSULTAR_CASA;
            this.accion = LS.ACCION_CONSULTAR;
          }
          break;
      }
    }
  }

  guardarpropiedad() {
    console.log('vamos a guardar una propiedad');
    this.cargando = true;
    this.casa.casapersonaList = this.listaLP;
    this.casa.persona_id = this.listaLP[0]; // this.listaPR[0].idrol
    this.casa.ubigeo_id = this.ubigeo.ubigeo;
    this.casa.serviciosList = this.servicios;
    if (this.accion === LS.ACCION_NUEVO) { // guardar nueva propiedad
      // guardar en lista fotos
      for (const item of this.archivosFotos) {
        const foto: Foto = new Foto();
        foto.nombre = item.nombreArchivo;
        foto.foto = item.url;
        foto.detalle = item.detalle;
        this.fotos.push(foto);
      }
      this.casa.fotosList = this.fotos;
      this.fotos = [];
      console.log('fotos: ');
      console.log(this.casa.fotosList);
      // guardar en lista documentos
      for (const item of this.archivosDocumentos) {
        const archivo: CasaArchivo = new CasaArchivo();
        archivo.nombre = item.nombreArchivo;
        archivo.archivo = item.url;
        archivo.tipoarchivo = ".pdf";
        this.archivos.push(archivo);
      }
      this.casa.archivosList = this.archivos;
      this.archivos = [];
      console.log('archivos: ');
      console.log(this.casa.archivosList);
      //
      this.casa.ganancia = this.casa.preciocontrato - this.casa.precioadquisicion;
      console.log('antes de guardar propiedad: ');
      console.log(this.casa);
      this.casasService.ingresarCasa(this.casa, this);
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
      this.casa.fotosList = fotos;
      fotos = [];
      console.log('fotos: ');
      console.log(this.casa.fotosList);
      // guardar en lista archivos
      let archivos: CasaArchivo[];
      archivos = [];
      for (const item of this.archivosDocumentos) {
        const archivo: CasaArchivo = new CasaArchivo();
        archivo.nombre = item.nombreArchivo;
        archivo.archivo = item.url;
        archivos.push(archivo);
        archivo.tipoarchivo = ".pdf";
      }
      this.casa.archivosList = archivos;
      archivos = [];
      console.log('archivos: ');
      console.log(this.casa.archivosList);
      //
      this.casa.casaservicioList = this.casaservicios;
      this.casa.ganancia = this.casa.preciocontrato - this.casa.precioadquisicion;
      console.log('antes de editar propiedad: ');
      console.log(this.casa);
      this.casasService.modificarCasa(this.casa, this);
    }
  }

  despuesDeIngresarCasa(data) {
    console.log('se guardo estos datos: ');
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    let casaTO = this.convertirCasaACasTO(data); // sirve para actualizar la tabla
    // luego se guarda las fotos. vale hacer eso en la sgt version
    this.activeModal.close(casaTO);
  }

  convertirCasaACasTO(data) {
    let casaTO = new CasaTO(data);
    casaTO.propietario = this.casa.persona_id.nombres;
    casaTO.nombrehabilitacionurbana = this.casa.ubigeo_id.ubigeo;
    // casaTO.siglas = this.casa.ubigeo_id.habilitacionurbana_id.siglas;
    return casaTO;
  }

  despuesDeModificarCasa(data) {
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    let casaTO = this.convertirCasaACasTO(data); // sirve para actualizar la tabla
    this.activeModal.close(casaTO);
  }

  traerParaEdicion(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.verNuevo = true;
    this.cargando = true;
    this.casasService.mostrarCasa(id, this);
  }

  despuesDeMostrarCasa(data) {
    // console.log(res);
    this.casa = data;
    this.listaLP = data.casapersonaList;
    this.persona = this.listaLP[0];
    this.ubigeo = data.ubigeo;
    this.servicios = data.serviciosList;
    this.casaservicios = data.casaservicioList;
    // Mapa
    this.casa.latitud = this.casa.latitud ? this.casa.latitud : this.latitude+""
    this.casa.longitud = this.casa.longitud ? this.casa.longitud : this.longitude+""
    this.latitude = Number.parseFloat(this.casa.latitud);
    this.longitude = Number.parseFloat(this.casa.longitud);
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
    console.log(this.casa);
    this.casa.fotosList = {}; // tiene que ser vacio xq son la lista de imagenes nuevas pa agregarse
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
    console.log(this.casa);
    this.casa.archivosList = {}; 
    this.cargando = false;
  }

  buscarpropietario() {
    const modalRef = this.modalService.open(PersonasComponent, {size: 'lg', keyboard: true});
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((result) => {
      this.persona = result;
      this.casa.persona_id = result;
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
      this.casa.ubigeo_id = result.ubigeo;
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  buscarservicio() {
    const modalRef = this.modalService.open(ServiciosComponent, {size: 'lg', keyboard: true});
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((result) => {
      let tieneservicio: Boolean = false;
      for (const servicio of this.servicios) {
        if (result.id === servicio.id) {
          console.log('si tiene servicio');
          tieneservicio = true;
        }
      }

      if (tieneservicio) {
        this.toastr.info('El servicio ya esta asignado');
      } else {
        this.servicios.push(result);
      }
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  postGuardarCasa() {
    // se genera el codigode la casa cuando la accion es nuevo
    this.cargando = true;
    // Mapa
    this.casa.latitud = this.casa.latitud === "" ? this.latitude + "" : this.casa.latitud;
    this.casa.longitud = this.casa.longitud === "" ? this.longitude + "" : this.casa.longitud;
    // End Mapa
    this.casasService.generarCodigoCasa(this);
  }

  despuesDeGenerarCodigoCasa(data) {
    this.cargando = false;
    this.casa.codigo = data;
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
      this.casa.path = 'casas/' + this.casa.codigo+'/fotos';
      this._cargaImagenes.cargarImagenesFirebase(this.casa.path, this.archivosFotos);
    } else {
      this.toastr.warning(LS.MSJ_INGRESE_DETALLE_POR_IMAGEN, LS.TAG_AVISO);
    }
  }

  limpiarFotos() {
    this.archivosFotos = [];
  }

  // Metodos para los archivos documentos
  cargarArchivos() {
    this.casa.pathArchivos = 'casas/' + this.casa.codigo+'/archivos';
    this._cargaImagenes.cargarImagenesFirebase(this.casa.pathArchivos, this.archivosDocumentos);
  }

  limpiarArchivos() {
    this.archivosDocumentos = [];
  }

  limpiarpropiedad() {
    // limpiar persona
    this.persona = new Persona();
    this.casa = new Casa();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.listaLP = [];
    // limpiar servicios
    this.servicios = [];
    this.casaservicios = [];
  }

  quitarservicio(servicio: Servicios) {
    const index = this.servicios.indexOf(servicio);
    this.servicios.splice(index, 1);
    // eliminamos en casaservicios
    let i = 0;
    for (const casaservicio of this.casaservicios) {
      if (servicio.id === casaservicio.servicio_id) {
        this.casaservicios.splice(i, 1);
      }
      i++;
    }
    // this.casaservicios.splice(index, 1);
    console.log('los servicios quedan: ');
    console.log(this.servicios);
    console.log('los casaservicios quedad');
    console.log(this.casaservicios);
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
  quitarfotocasa(foto: Foto) {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      // elimino de la bd
      this.eliminarfotocasa(foto);
      // elimino de firebase storage
      this._cargaImagenes.deleteArchivo(this.casa.path, foto.nombre);
      if (this.casa.foto === foto.foto) {
        this.casa.foto = null;
      }
      this.toastr.success(result.operacionMensaje, 'Exito');
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  eliminarfotocasa(foto: Foto) {
    this.casasService.eliminarFotoCasa(foto, this);
  }

  despuesDeEliminarFotoCasa(data) {
    console.log('se ha eliminado:');
    console.log(data);
  }

  mostrarFotoPrincipal(item: FileItem) {
    if (item.progreso >= 100 ) {
      this.casa.foto = item.url;
    }
  }

  mostrarFotoPrincipalExistente(foto: Foto) {
    this.casa.foto = foto.foto;
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

  quitararchivocasa(archivo: CasaArchivo) {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      // elimino de la bd
      this.eliminararchivocasa(archivo);
      // elimino de firebase storage
      this._cargaImagenes.deleteArchivo(this.casa.pathArchivos, archivo.nombre);
      this.toastr.success(result.operacionMensaje, 'Exito');
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  eliminararchivocasa(archivo: CasaArchivo) {
    this.casasService.eliminarArchivoCasa(archivo, this);
  }

  despuesDeEliminarArchivoCasa(data) {
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
    this.casa.latitud = this.latitude + "";
    this.casa.longitud = this.longitude + "";
  }
  // End Mapa
}
