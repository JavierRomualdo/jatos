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
import { ModalPersonaComponent } from '../../../configuracion/empresa/modal-persona/modal-persona.component';
import { ModalUbigeoComponent } from '../../../configuracion/ubigeo/modal-ubigeo/modal-ubigeo.component';
import { ModalServicioComponent } from '../../../configuracion/empresa/modal-servicio/modal-servicio.component';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { HabitacionService } from '../habitacion.service';
import { FotosService } from 'src/app/servicios/fotos/fotos.service';
import { LS } from 'src/app/contantes/app-constants';
import { HabitacionTO } from 'src/app/entidadesTO/empresa/HabitacionTO';
import { ZoomControlOptions, ControlPosition, ZoomControlStyle, FullscreenControlOptions, 
  ScaleControlOptions, ScaleControlStyle, PanControlOptions } from '@agm/core/services/google-maps-types';

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
  public archivos: FileItem[] = [];
  public servicios: Servicios[];
  public habitacionservicios: Habitacionservicio[];
  public fotos: Foto[];
  public persona: Persona;
  public ubigeo: UbigeoGuardar;
  public listaLP: any = []; // lista de persona-roles
  public accion: string = null;
  public tituloForm: string = null;
  public constantes: any = LS;
  public parametrosFoto: any = null;
  // Mapa
  public latitude: number = -5.196395;
  public longitude: number = -80.630287;
  public zoom: number = 16;

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private habitacionService: HabitacionService,
    private fotosService: FotosService,
    private _cargaImagenes: CargaImagenesService,
    private toastr: ToastrService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.habitacion = new Habitacion();
    this.fotos = [];
    this.servicios = [];
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
            this.postGuardarHabitacion();
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
    this.cargando = true;
    this.habitacion.habitacionpersonaList = this.listaLP;
    this.habitacion.persona_id = this.listaLP[0]; // this.listaPR[0].idrol
    this.habitacion.ubigeo_id = this.ubigeo.ubigeo;
    this.habitacion.serviciosList = this.servicios;
    if (this.accion === LS.ACCION_NUEVO) { // guardar nueva habitacion
      // guardar en lista fotos
      for (const item of this.archivos) {
        const foto: Foto = new Foto();
        foto.nombre = item.nombreArchivo;
        foto.foto = item.url;
        foto.detalle = item.detalle;
        this.fotos.push(foto);
      }
      this.habitacion.fotosList = this.fotos;
      this.fotos = [];
      console.log('fotos: ');
      console.log(this.habitacion.fotosList);
      this.habitacion.ganancia = this.habitacion.preciocontrato - this.habitacion.precioadquisicion;
      console.log('antes de guardar habitacion: ');
      console.log(this.habitacion);
      this.habitacionService.ingresarHabitacion(this.habitacion, this);
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
      this.habitacion.fotosList = fotos;
      this.habitacion.habitacionservicioList = this.habitacionservicios;
      fotos = [];
      console.log('fotos: ');
      console.log(this.habitacion.fotosList);
      this.habitacion.ganancia = this.habitacion.preciocontrato - this.habitacion.precioadquisicion;
      console.log('antes de editar propiedad: ');
      console.log(this.habitacion);
      this.habitacionService.modificarHabitacion(this.habitacion, this);
    }
  }

  despuesDeIngresarHabitacion(data) {
    console.log('se guardo estos datos: ');
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    let habitacionTO = this.convertirCasaACasTO(data); // sirve para actualizar la tabla
    // luego se guarda las fotos. vale hacer eso en la sgt version
    this.activeModal.close(habitacionTO);
  }

  convertirCasaACasTO(data) {
    let habitacionTO = new HabitacionTO(data);
    habitacionTO.propietario = this.habitacion.persona_id.nombres;
    habitacionTO.ubicacion = this.habitacion.ubigeo_id.ubigeo;
    return habitacionTO;
  }

  despuesDeModificarHabitacion(data) {
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    let habitacionTO = this.convertirCasaACasTO(data); // sirve para actualizar la tabla
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
    this.habitacion.fotosList = {}; // tiene que ser vacio xq son la lista de imagenes nuevas pa agregarse
    // traer archivos de firebase storage
    // this._cargaImagenes.getImagenes(res.path);

    // aqui metodo para mostrar todas las imagenes de este propiedad ....
    // this.imagen = res.foto;
    // this.imagenAnterior = res.foto;
    this.cargando = false;
  }

  buscarpropietario() {
    const modalRef = this.modalService.open(ModalPersonaComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
      this.persona = result;
      this.habitacion.persona_id = result;
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
      this.habitacion.ubigeo_id = result.ubigeo;
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  buscarservicio() {
    const modalRef = this.modalService.open(ModalServicioComponent, {size: 'lg', keyboard: true});
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

  postGuardarHabitacion() {
    // se genera el codigode la habitacion cuando la accion es nuevo
    this.cargando = true;
    // Mapa
    this.habitacion.latitud = this.habitacion.latitud === "" ? this.latitude + "" : this.habitacion.latitud;
    this.habitacion.longitud = this.habitacion.longitud === "" ? this.longitude + "" : this.habitacion.longitud;
    // End Mapa
    this.habitacionService.generarCodigoHabitacion(this);
  }

  despuesDeGenerarCodigoHabitacion(data) {
    this.cargando = false;
    this.habitacion.codigo = data;
    this.habitacion.contrato = "A";
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
      this.habitacion.path = 'habitaciones/' + this.persona.dni;
      this._cargaImagenes.cargarImagenesFirebase(this.habitacion.path, this.archivos);
    } else {
      this.toastr.info('Ya esta asignado');
    }
  }

  limpiarArchivos() {
    this.archivos = [];
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
      this.toastr.success(result.operacionMensaje, 'Exito');
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
