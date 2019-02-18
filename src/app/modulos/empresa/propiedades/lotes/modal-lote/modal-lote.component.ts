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
  public archivos: FileItem[] = [];
  public fotos: Foto[];
  public persona: Persona;
  public listaLP: any = []; // lista de persona-roles
  public ubigeo: UbigeoGuardar;
  public accion: string = null;
  public tituloForm: string = null;
  public constantes: any = LS;
  public parametrosFoto: any = null;
  public estaSobreElemento: any;
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
  ) { }

  ngOnInit() {
    this.lote = new Lote();
    this.fotos = [];
    this.persona = new Persona();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.archivos = [];
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
      for (const item of this.archivos) {
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
      this.lote.ganancia = this.lote.preciocontrato - this.lote.precioadquisicion;
      console.log('antes de guardar lote: ');
      console.log(this.lote);
      this.loteService.ingresarLote(this.lote, this);
    } else if (this.accion === LS.ACCION_EDITAR) { // guardar el rol editado
      // guardar en lista fotos
      let fotos: Foto[];
      fotos = [];
      for (const item of this.archivos) {
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

    let loteTO = this.convertirCocheraACocheraTO(data); // sirve para actualizar la tabla
    // luego se guarda las fotos. vale hacer eso en la sgt version
    this.activeModal.close(loteTO);
  }

  convertirCocheraACocheraTO(data) {
    let loteTO = new LoteTO(data);
    loteTO.propietario = this.lote.persona_id.nombres;
    loteTO.ubicacion = this.lote.ubigeo_id.ubigeo;
    return loteTO;
  }

  despuesDeModificarLote(data) {
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    let loteTO = this.convertirCocheraACocheraTO(data); // sirve para actualizar la tabla
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
    // traer archivos de firebase storage
    // this._cargaImagenes.getImagenes(res.path);

    // aqui metodo para mostrar todas las imagenes de este lote ....
    // this.imagen = res.foto;
    // this.imagenAnterior = res.foto;
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

  cargarImagenes() {
    let estadetalle: Boolean = true;
    for (const item of this.archivos) {
      if (item.detalle === '' || item.detalle === null || item.detalle === undefined) {
        // aqui falta el detalle (input type text) del archivo que obligatoriamente debe tener contenido
        estadetalle = false;
      }
    }
    if (estadetalle) {
      this.lote.path = 'lotes/' + this.persona.dni;
      this._cargaImagenes.cargarImagenesFirebase(this.lote.path, this.archivos);
    } else {
      this.toastr.info('¡ Ingrese detalle de la imagen(s)!');
    }
  }

  limpiarArchivos() {
    this.archivos = [];
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

  quitarfoto(item: FileItem) {
    const index = this.archivos.indexOf(item);
    this.archivos.splice(index, 1);
    console.log('las fotos que quedan: ');
    console.log(this.archivos);
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
      this.archivos.push(new FileItem(file));
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
