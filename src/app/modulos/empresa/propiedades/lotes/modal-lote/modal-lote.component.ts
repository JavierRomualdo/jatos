import { Component, OnInit, Input } from '@angular/core';
import { Lote } from 'src/app/entidades/entidad.lote';
import { FileItem } from 'src/app/entidades/file-item';
import { Foto } from 'src/app/entidades/entidad.foto';
import { Persona } from 'src/app/entidades/entidad.persona';
import { UbigeoGuardar } from 'src/app/entidades/entidad.ubigeoguardar';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CargaImagenesService } from 'src/app/servicios/carga-imagenes.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/servicios/auth.service';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { ModalUbigeoComponent } from '../../../configuracion/ubigeo/modal-ubigeo/modal-ubigeo.component';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { LoteService } from '../lote.service';
import { FotosService } from 'src/app/servicios/fotos/fotos.service';
import { LS } from 'src/app/contantes/app-constants';
import { LoteTO } from 'src/app/entidadesTO/empresa/LoteTO';
import { ZoomControlOptions, ControlPosition, ZoomControlStyle, FullscreenControlOptions, 
   ScaleControlOptions, ScaleControlStyle, PanControlOptions } from '@agm/core/services/google-maps-types';
import { PersonasComponent } from '../../../configuracion/personas/personas.component';
import { AppAutonumeric } from 'src/app/directivas/autonumeric/AppAutonumeric';
import { LoteArchivo } from 'src/app/entidades/entidad.lotearchivo';

@Component({
  selector: 'app-modal-lote',
  templateUrl: './modal-lote.component.html',
  styleUrls: ['./modal-lote.component.css']
})
export class ModalLoteComponent implements OnInit {

  @Input() parametros;
  @Input() isModal: boolean; // establecemos si este componente es modal o no 
  public verNuevo = false;
  public cargando: Boolean = false;
  public lote: Lote;
  public archivosFotos: FileItem[] = [];
  public archivosDocumentos: FileItem[] = [];
  public fotos: Foto[];
  public archivos: LoteArchivo[];
  public persona: Persona;
  public listaLP: any = []; // lista de persona-roles
  public ubigeo: UbigeoGuardar;
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
    private _cargaImagenes: CargaImagenesService,
    private loteService: LoteService,
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
    this.lote = new Lote();
    this.fotos = [];
    this.archivos = [];
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
          this.tituloForm = LS.TITULO_FORM_CONSULTAR_LOTE;
          this.despuesDeMostrarLote(this.parametros.lote);
          // this.traerParaEdicion(this.parametros.idCochera);
          break;
        case LS.ACCION_EDITAR:
          this.tituloForm = LS.TITULO_FORM_EDITAR_LOTE;
          this.despuesDeMostrarLote(this.parametros.lote);
          // this.traerParaEdicion(this.parametros.idCochera);
          break;
        case LS.ACCION_NUEVO:
          if (this.isModal) {
            this.tituloForm = LS.TITULO_FORM_NUEVO_LOTE;
            this.postGuardarLote();
          } else {
            this.tituloForm = LS.TITULO_FORM_CONSULTAR_LOTE;
          }
          break;
      }
    }
  }

  guardarlote() {
    console.log('vamos a guardar un lote');
    this.cargando = true;
    this.lote.lotepersonaList = this.listaLP;
    this.lote.persona_id = this.listaLP[0]; // this.listaPR[0].idrol
    this.lote.ubigeo_id = this.ubigeo.ubigeo;
    if (this.accion === LS.ACCION_NUEVO) { // guardar nuevo rol
      // guardar en lista fotos
      for (const item of this.archivosFotos) {
        const foto: Foto = new Foto();
        foto.nombre = item.nombreArchivo;
        foto.foto = item.url;
        foto.detalle = item.detalle;
        this.fotos.push(foto);
      }
      this.lote.fotosList = this.fotos;
      this.fotos = [];
      console.log('fotos: ');
      console.log(this.lote.fotosList);
      // guardar en lista documentos
      for (const item of this.archivosDocumentos) {
        const archivo: LoteArchivo = new LoteArchivo();
        archivo.nombre = item.nombreArchivo;
        archivo.archivo = item.url;
        archivo.tipoarchivo = ".pdf";
        this.archivos.push(archivo);
      }
      this.lote.archivosList = this.archivos;
      this.archivos = [];
      console.log('archivos: ');
      console.log(this.lote.archivosList);
      //
      this.lote.ganancia = this.lote.preciocontrato - this.lote.precioadquisicion;
      console.log('antes de guardar lote: ');
      console.log(this.lote);
      this.loteService.ingresarLote(this.lote, this);
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
      this.lote.fotosList = fotos;
      fotos = [];
      console.log('fotos: ');
      console.log(this.lote.fotosList);
      // guardar en lista archivos
      let archivos: LoteArchivo[];
      archivos = [];
      for (const item of this.archivosDocumentos) {
        const archivo: LoteArchivo = new LoteArchivo();
        archivo.nombre = item.nombreArchivo;
        archivo.archivo = item.url;
        archivos.push(archivo);
        archivo.tipoarchivo = ".pdf";
      }
      this.lote.archivosList = archivos;
      archivos = [];
      console.log('archivos: ');
      console.log(this.lote.archivosList);
      //
      this.lote.ganancia = this.lote.preciocontrato - this.lote.precioadquisicion;
      console.log('antes de editar lote: ');
      console.log(this.lote);
      this.loteService.modificarLote(this.lote, this);
    }
  }

  despuesDeIngresarLote(data) {
    console.log('se guardo estos datos: ');
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;

    let loteTO = this.convertirLoteALoteTO(data); // sirve para actualizar la tabla
    // luego se guarda las fotos. vale hacer eso en la sgt version
    this.activeModal.close(loteTO);
  }

  convertirLoteALoteTO(data) {
    let loteTO = new LoteTO(data);
    loteTO.propietario = this.lote.persona_id.nombres;
    loteTO.nombrehabilitacionurbana = this.lote.ubigeo_id.ubigeo;
    loteTO.siglas = this.lote.ubigeo_id.habilitacionurbana_id.siglas;
    loteTO.ubicacion = this.lote.ubigeo_id.rutaubigeo;
    return loteTO;
  }

  despuesDeModificarLote(data) {
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    let loteTO = this.convertirLoteALoteTO(data); // sirve para actualizar la tabla
    this.activeModal.close(loteTO);
  }

  traerParaEdicion(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.verNuevo = true;
    this.cargando = true;
    this.loteService.mostrarLote(id, this);
  }

  despuesDeMostrarLote(data) {
    // console.log(res);
    this.lote = data;
    this.listaLP = data.lotepersonaList;
    this.persona = this.listaLP[0] ;
    this.ubigeo = data.ubigeo;
    // Mapa
    this.lote.latitud = this.lote.latitud ? this.lote.latitud : this.latitude+""
    this.lote.longitud = this.lote.longitud ? this.lote.longitud : this.longitude+""
    this.latitude = Number.parseFloat(this.lote.latitud);
    this.longitude = Number.parseFloat(this.lote.longitud);
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
    console.log(this.lote);
    this.lote.fotosList = {}; // tiene que ser vacio xq son la lista de imagenes nuevas pa agregarse
    // traer archivosFotos de firebase storage
    // this._cargaImagenes.getImagenes(res.path);

    // aqui metodo para mostrar todas las imagenes de este lote ....
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
    console.log(this.lote);
    this.lote.archivosList = {}; 
    this.cargando = false;
  }

  buscarpropietario() {
    const modalRef = this.modalService.open(PersonasComponent, {size: 'lg', keyboard: true});
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((result) => {
      this.persona = result;
      this.lote.persona_id = result;
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
      this.lote.ubigeo_id = result.ubigeo;
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  postGuardarLote() {
    // se genera el codigode la cochera cuando la accion es nuevo
    this.cargando = true;
    // Mapa
    this.lote.latitud = this.lote.latitud === "" ? this.latitude + "" : this.lote.latitud;
    this.lote.longitud = this.lote.longitud === "" ? this.longitude + "" : this.lote.longitud;
    // End Mapa
    this.loteService.generarCodigoLote(this);
  }

  despuesDeGenerarCodigoLote(data) {
    this.cargando = false;
    this.lote.codigo = data;
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
      this.lote.path = 'lotes/' + this.persona.dni;
      this._cargaImagenes.cargarImagenesFirebase(this.lote.path, this.archivosFotos);
    } else {
      this.toastr.warning(LS.MSJ_INGRESE_DETALLE_POR_IMAGEN, LS.TAG_AVISO);
    }
  }

  limpiarFotos() {
    this.archivosFotos = [];
  }

  // Metodos para los archivos documentos
  cargarArchivos() {
    this.lote.pathArchivos = 'lotes/' + this.lote.codigo+'/archivos';
    this._cargaImagenes.cargarImagenesFirebase(this.lote.pathArchivos, this.archivosDocumentos);
  }

  limpiarArchivos() {
    this.archivosDocumentos = [];
  }

  limpiarlote() {
    // limpiar persona
    this.persona = new Persona();
    this.lote.persona_id = new Persona();
    this.lote.ubigeo_id = new Ubigeo();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.listaLP = [];
    // limpiar foto
    this.lote.foto = null;
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

  quitarfotolote(foto: Foto) {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      // elimino de la bd
      this.eliminarfotolote(foto);
      // elimino de firebase storage
      this._cargaImagenes.deleteArchivo(this.lote.path, foto.nombre);
      if (this.lote.foto === foto.foto) {
        this.lote.foto = null;
      }
      this.toastr.success(result.operacionMensaje, 'Exito');
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  eliminarfotolote(foto: Foto) {
    this.loteService.eliminarFotoLote(foto, this);
  }

  despuesDeEliminarFotoLote(data) {
    console.log('se ha eliminado:');
    console.log(data);
  }

  mostrarFotoPrincipal(item: FileItem) {
    if (item.progreso >= 100 ) {
      this.lote.foto = item.url;
    }
  }

  mostrarFotoPrincipalExistente(foto: Foto) {
    this.lote.foto = foto.foto;
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

  quitararchivolote(archivo: LoteArchivo) {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      // elimino de la bd
      this.eliminararhivolote(archivo);
      // elimino de firebase storage
      this._cargaImagenes.deleteArchivo(this.lote.pathArchivos, archivo.nombre);
      this.toastr.success(result.operacionMensaje, 'Exito');
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  eliminararhivolote(archivo: LoteArchivo) {
    this.loteService.eliminarArchivoLote(archivo, this);
  }

  despuesDeEliminarArchivoLote(data) {
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
    this.lote.latitud = this.latitude + "";
    this.lote.longitud = this.longitude + "";
  }
  // End Mapa
}
