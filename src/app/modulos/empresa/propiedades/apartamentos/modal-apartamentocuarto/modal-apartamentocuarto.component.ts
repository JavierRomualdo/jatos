import { Component, OnInit, Input } from '@angular/core';
import { ApartamentoCuartoMensaje } from 'src/app/entidades/entidad.apartamentocuartomensaje';
import { ApartamentoCuarto } from 'src/app/entidades/entidad.apartamentocuarto';
import { FileItem } from 'src/app/entidades/file-item';
import { Foto } from 'src/app/entidades/entidad.foto';
import { Persona } from 'src/app/entidades/entidad.persona';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/servicios/auth.service';
import { ModalPersonaComponent } from '../../../configuracion/empresa/modal-persona/modal-persona.component';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { ApartamentocuartoService } from './apartamentocuarto.service';
import { FotosService } from 'src/app/servicios/fotos/fotos.service';

@Component({
  selector: 'app-modal-apartamentocuarto',
  templateUrl: './modal-apartamentocuarto.component.html',
  styleUrls: ['./modal-apartamentocuarto.component.css']
})
export class ModalApartamentocuartoComponent implements OnInit {

  @Input() edit;
  public cargando: Boolean = false;
  public vermensajes: Boolean = false;
  public estadomensajes: Boolean = true;
  public confirmarcambioestado: Boolean = false;
  public apartamentocuartos: any = []; // lista proyecto
  public apartamentocuarto_id: number;
  public mensajes: ApartamentoCuartoMensaje[];
  public parametros: ApartamentoCuarto;
  //
  public apartamentocuarto: ApartamentoCuarto;
  public archivos: FileItem[] = [];
  public fotos: Foto[];
  public persona: Persona;
  public listaLP: any = []; // lista de persona-roles
  errors: Array<Object> = [];
  //
  public activarFormulario: Boolean = false;
  public verNuevo: Boolean = false;

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private apartamentoCuartoService: ApartamentocuartoService,
    private toastr: ToastrService,
    private auth: AuthService,
  ) {
    this.parametros = new ApartamentoCuarto();
    this.mensajes = [];
    this.parametros.persona_id = new Persona();
    //
    this.persona = new Persona();
    this.apartamentocuarto = new ApartamentoCuarto();
    this.fotos = [];
    this.archivos = [];
    this.listaLP = [];
  }

  ngOnInit() {
    this.listarApartamentoCuartos();
    this.activarFormulario = false;
    this.vermensajes = false;
  }

  limpiar() {
    this.parametros = new ApartamentoCuarto();
    this.parametros.persona_id = new Persona();
    this.apartamentocuartos = [];
    this.listarApartamentoCuartos();
  }

  busqueda() {
    let nohayvacios: Boolean = false;
    if (this.parametros.persona_id.nombres !== undefined &&
      this.parametros.persona_id.nombres !== '') {
        nohayvacios = true;
      }
    if (this.parametros.direccion !== undefined && this.parametros.direccion !== '') {
      // this.toastr.info('Hay detalle datos: ' + this.parametros.detalle);
      nohayvacios = true;
    }
    if (nohayvacios) {
      this.cargando = true;
      console.log(this.parametros);
      this.apartamentoCuartoService.busquedaApartamentoCuartos(this.parametros, this);
    } else {
      this.toastr.info('Ingrese datos');
    }
  }

  despuesDeBusquedaApartamentoCuartos(data) {
    console.log(data);
    this.apartamentocuartos = data;
    this.cargando = false;
  }

  editarApartamentoCuarto(id) {
    this.activarFormulario = true;
    this.vermensajes = false;
    this.verNuevo = false;
    this.traerParaEdicion(id);
  }

  nuevoApartamentoCuarto() {
    this.activarFormulario = true;
    this.vermensajes = false;
    this.limpiarapartamentocuarto();
    this.verNuevo = true;
  }

  traerParaEdicion(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.cargando = true;
    this.apartamentoCuartoService.mostrarApartamentoCuarto(id, this);
  }

  despuesDeMostrarApartamentoCuarto(data) {
    // console.log(res);
    this.apartamentocuarto = data;
    this.listaLP = data.casapersonaList;
    this.persona = this.listaLP[0];

    for (const item of data.fotosList) {
      console.log('foto: ');
      console.log(item);
      this.fotos.push(item);
    }
    console.log('fotoss : ');
    console.log(this.fotos);
    // this.fotos = res.fotosList;
    console.log('traido para edicion');
    console.log(this.apartamentocuarto);
    this.apartamentocuarto.fotosList = {}; // tiene que ser vacio xq son la lista de imagenes nuevas pa agregarse
    // traer archivos de firebase storage
    // this._cargaImagenes.getImagenes(res.path);

    // aqui metodo para mostrar todas las imagenes de este propiedad ....
    // this.imagen = res.foto;
    // this.imagenAnterior = res.foto;
    this.cargando = false;
  }

  guardarapartamentoCuarto() {
    console.log('vamos a guardar una apartamento');
    this.cargando = true;
    if (this.activarFormulario && this.verNuevo) { // guardar nueva apartamento
      // guardar en lista fotos
      for (const item of this.archivos) {
        const foto: Foto = new Foto();
        foto.nombre = item.nombreArchivo;
        foto.foto = item.url;
        foto.detalle = item.detalle;
        this.fotos.push(foto);
      }
      this.apartamentocuarto.fotosList = this.fotos;
      this.fotos = [];
      console.log('fotos: ');
      console.log(this.apartamentocuarto.fotosList);
      console.log('antes de guardar apartamentocuarto: ');
      console.log(this.apartamentocuarto);
      this.apartamentoCuartoService.ingresarApartamentoCuarto(this.apartamentocuarto, this);
    } else if (this.activarFormulario && !this.verNuevo) { // guardar el rol editado
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
      this.apartamentocuarto.fotosList = fotos;
      fotos = [];
      console.log('fotos: ');
      console.log(this.apartamentocuarto.fotosList);
      console.log('antes de editar apartamentocuarto: ');
      console.log(this.apartamentocuarto);
      this.apartamentoCuartoService.modificarApartamentoCuarto(this.apartamentocuarto, this);
    }
  }

  despuesDeIngresarApartamentoCuarto(data) {
    console.log('se guardo estos datos: ');
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    this.activeModal.close(this.apartamentocuarto);
  }

  despuesDeModificarApartamentoCuarto(data) {
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    this.activeModal.close(this.apartamentocuarto);
  }

  limpiarapartamentocuarto() {
    // limpiar persona
    this.apartamentocuarto = new ApartamentoCuarto();
    this.apartamentocuarto.persona_id = new Persona();
    this.listaLP = [];
    // limpiar foto
    this.apartamentocuarto.foto = null;
  }

  buscarpropietario() {
    const modalRef = this.modalService.open(ModalPersonaComponent, {
      size: 'lg',
      keyboard: true
    });
    modalRef.result.then(
      result => {
        this.persona = result;
        this.apartamentocuarto.persona_id = result;
        this.listaLP[0] = result;
        this.auth.agregarmodalopenclass();
      },
      reason => {
        this.auth.agregarmodalopenclass();
      }
    );
  }

  confirmarcambiodeestado(apartamentocuarto): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoservicio(apartamentocuarto);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      apartamentocuarto.estado = !apartamentocuarto.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoservicio(apartamentocuarto) {
    this.cargando = true;
    this.apartamentoCuartoService.cambiarEstadoApartamentoCuarto(apartamentocuarto.id, this);
  }

  despuesDeCambiarEstadoApartamentoCuarto(data) {
    console.log(data);
    this.listarApartamentoCuartos();
    this.cargando = false;
  }

  confirmarcambiodeestadomensaje(mensaje): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.confirmarmensajeleido(mensaje);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      mensaje.estado = !mensaje.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  confirmarmensajeleido(mensaje) {
    // this.cargando = true;
    this.apartamentoCuartoService.cambiarEstadoMensajeApartamentoCuarto(mensaje.id, this);
  }

  despuesCambiarEstadoMensajeApartamentoCuarto(data) {
    console.log(data);
    this.listarmensajes(this.apartamentocuarto_id, this.estadomensajes);
    // this.cargando = false;
  }

  listarApartamentoCuartos() {
    this.cargando = true;
    this.apartamentoCuartoService.listarApartamentoCuartos(this);
  }

  despuesDeListarApartamentoCuartos(data) {
    this.apartamentocuartos = data;
    this.cargando = false;
    console.log('resultado: ');
    console.log(this.apartamentocuartos);
  }

  listarmensajes(apartamentocuarto_id, estado) {
    console.log('estado del mensaje: ');
    console.log(estado);
    this.estadomensajes = estado;
    let valor = 1;
    if (estado === false) {
      valor = 0;
    }
    console.log(valor);
    this.cargando = true;
    this.vermensajes = true;
    this.activarFormulario = false;
    this.apartamentocuarto_id = apartamentocuarto_id;
    let parametros = {apartamentocuarto_id: apartamentocuarto_id, valor: valor};
    this.apartamentoCuartoService.listarMensajesApartamentoCuarto(parametros, this);
  }

  despuesDeListarMensajesApartamentoCuarto(data) {
    this.mensajes = data;
    this.cargando = false;
    console.log('resultado: ');
    console.log(this.mensajes);
  }

  private cerrarmensajes() {
    this.vermensajes = false;
    this.activarFormulario = true;
    this.listarApartamentoCuartos();
  }

  cerrarFomulario() {
    this.activarFormulario = false;
    this.vermensajes = false;
  }
}
