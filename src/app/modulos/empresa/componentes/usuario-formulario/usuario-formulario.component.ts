import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Users } from 'src/app/entidades/entidad.users';
import { FileItem } from 'src/app/entidades/file-item';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CargaImagenesService } from 'src/app/servicios/carga-imagenes.service';
import { LS } from 'src/app/contantes/app-constants';
import { UsuarioTO } from 'src/app/entidadesTO/empresa/UsuarioTO';
import { UsuarioService } from '../../configuracion/usuarios/usuario.service';
import { DataUpdateService } from 'src/app/servicios/dataUpdate/data-update.service';

@Component({
  selector: 'app-usuario-formulario',
  templateUrl: './usuario-formulario.component.html',
  styleUrls: ['./usuario-formulario.component.css']
})
export class UsuarioFormularioComponent implements OnInit {

  @Input() parametrosFormulario: any;
  @Output() enviarAccion = new EventEmitter();
  @Output() enviarActivar = new EventEmitter();
  public cargando: boolean = false;
  public fotoingresada = false;

  
  public usuario: Users;

  public imagen: string = null;
  public imagenAnterior: string = null; // solo se usara para editar usuario
  public vieneDePerfil: boolean = false;
  public archivo: FileItem;
  public file: File = null;
  public accion: string = null;
  public tituloForm: string = null;
  public constantes: any = LS;
  public listadoImagenes: any[] = [];
  public uploadedFiles: any[] = [];
  public parametrosFoto: any = null;

  constructor(
    public activeModal: NgbActiveModal,
    private _cargaImagenes: CargaImagenesService,
    private usuarioService: UsuarioService,
    private dataUpdateService: DataUpdateService
  ) { }

  ngOnInit() {
    this.usuario = new Users();
    this.archivo = new FileItem(null);
  }

  ngOnChanges(changes) {
    if (changes.parametrosFormulario) {
      if (changes.parametrosFormulario.currentValue) {
        this.accion = this.parametrosFormulario.accion;
        this.vieneDePerfil = LS.KEY_IS_PERFIL_USER;
        LS.KEY_IS_PERFIL_USER = false;
        this.postIniciarVistaFormulario(this.accion);
      }
    }
  }

  postIniciarVistaFormulario(accion: string) {
    // titulo del formulario
    switch (accion) {
      case LS.ACCION_NUEVO:
        this.tituloForm = LS.TITULO_FORM_NUEVO_USUARIO;
        break;
      case LS.ACCION_EDITAR:
        this.tituloForm = LS.TITULO_FORM_EDITAR_USUARIO;
        this.traerParaEdicion(this.parametrosFormulario.id);
        break;
      case LS.ACCION_CONSULTAR:
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_USUARIO;
        this.traerParaEdicion(this.parametrosFormulario.id);
        break;
      default:
        break;
    }
  }

  traerParaEdicion(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.cargando = true;
    this.usuarioService.mostrarUsuario(id, this);
  }

  despuesDeMostrarUsuario(data) {
    this.usuario = data;
    console.log('traido para edicion');
    console.log(this.usuario);
    this.imagen = data.foto;
    this.imagenAnterior = data.foto;

    this.cargando = false;
  }

  guardarusuario() {
    this.cargando = true;
    switch (this.accion) {
      case LS.ACCION_NUEVO:
        if (this.archivo.archivo == null) { // el usuario guarda sin su foto
          console.log('usuario antes de guardar:');
          console.log(this.usuario);
        } else { // el usuario guarda con su foto
          console.log('inicio de guardar usuario');
          this.usuario.foto = this.archivo.url;
        }
        console.log('procesando nuevo usuario ...');
        this.usuarioService.ingresarUsuario(this.usuario, this);
        break;
      case LS.ACCION_EDITAR:
        if (this.imagenAnterior === this.imagen) { // el usuario edita con su misma foto
          console.log('usuario antes de guardar:');
          console.log(this.usuario);
        } else { // el usuario cambio su foto
          this.usuario.foto = this.archivo.url;
        }
        console.log('editando usuario...');
        this.usuarioService.modificarUsuario(this.usuario, this);
        break;
      default:
        break;
    }
  }

  convertirUsersAUsuarioTO(usuario: Users) {
    let parametros = {
      accion : this.accion,
      usuarioTO: new UsuarioTO(usuario)
    }
    return parametros;
  }

  despuesDeIngresarUsuario(data) {
    console.log('usuario gaurdado: ');
    console.log(data);
    this.cargando = false;
    // cierra el modal y adems pasa un parametro al componente que lo llamo a este modal usuario
    if (this.parametrosFormulario.isModal) {
      this.activeModal.close(this.usuario);
    } else {
      this.enviarAccion.emit(this.convertirUsersAUsuarioTO(this.usuario));
    }
  }

  despuesDeModificarUsuario(data) {
    console.log(data);
    this.cargando = false;
    if (this.parametrosFormulario.isModal) {
      this.activeModal.close();
    } else {
      if (LS.KEY_FOTO_PERFIL) {
        // aca actualizamos la foto en dataUpdateService
        this.dataUpdateService.setFotoPerfil(this.usuario.foto);
        localStorage.setItem(LS.KEY_FOTO_PERFIL, JSON.stringify(this.usuario.foto));
      }
      this.enviarAccion.emit(this.convertirUsersAUsuarioTO(this.usuario));
    }
  }

  // subir imagen en firebase (cloud storage)
  subirimagen() {
    this.archivo = new FileItem(this.file);
    switch (this.accion) {
      case LS.ACCION_NUEVO:
        this.cargarImagen();
        this.usuario.nombrefoto = this.archivo.nombreArchivo;
        console.log('usuario por ahora: ');
        console.log(this.usuario);
        break;
      case LS.ACCION_EDITAR:
        if (this.imagenAnterior !== this.imagen) { // la imagen es diferente
          // entonces se elimina la antigua y se sube una nueva imagen
          console.log('ha cambiado de imagen');
          if (this.usuario.nombrefoto != null) {
            console.log('nombrefoto antigua: ' + this.usuario.nombrefoto);
            this._cargaImagenes.deleteArchivo('usuarios', this.usuario.nombrefoto);
          }
          this.cargarImagen();
          this.usuario.nombrefoto = this.archivo.nombreArchivo;
        }
        break;
      default:
        break;
    }
  }

  /*para guardar las imagenes en storage firebase */
  cargarImagen() {
    // el primer parametro es el nombre de la carpeta que le vamos bueno el nombre de la carpeta
    // lo vamos a ponerle al nombre del usuario y el segundo parametro su imagen para almacenar
    // en firebase (storage (aca se sube el archivo completo) y firestore (aca se registra el archivo en la bd))
    this._cargaImagenes.cargarImagen('usuarios', this.archivo);
    // this._cargaImagenes.cargarImagen('usuarios/', this.archivos[0]); // +  this.usuario.name
  }

  pruebaSobreElemento(event) {
    console.log(event);
  }

  verContrasena(idInput, idSpan) {
    let element = document.getElementById(idInput);
    let span = document.getElementById(idSpan);
    if (element) {
      if (element['type'] === 'password') {
        element['type'] = 'text';
        span ? span['className'] = LS.ICON_EYE_SLASH : null;
      } else {
        element['type'] = 'password';
        span ? span['className'] = LS.ICON_EYE : null;
      }
    }
  }

  cancelar() {
    let parametros = {
      accion : LS.ACCION_CANCELAR,
      usuarioTO: new UsuarioTO(this.usuario)
    }
    this.enviarAccion.emit(parametros);
  }

  onUpload(event) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
  }

  // se selecciona la imagen y los muestra en el panel
  onSelect(event) {
    for(let file of event.files) {
      this.file = file;
      const reader = new FileReader();
      // this.imagen es la url de la imagen
      reader.onload = (event: any) => { this.imagen = event.target.result; };
      reader.readAsDataURL(event.files[0]);
    }
  }

  // modal de mostrar imagen
  mostrarModalImagen() {
    this.parametrosFoto = {
      display: true,
      foto: this.imagen
    }
  }

  onDialogClose(event) {
    this.parametrosFoto = null;
  } //

  eliminarImagen() {
    this.imagen = null;
    this.archivo.archivo = null;
    this.archivo.url = null;
  }
}
