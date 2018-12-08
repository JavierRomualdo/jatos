import { Component, OnInit, Input } from '@angular/core';
import { Users } from 'src/app/entidades/entidad.users';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CargaImagenesService } from 'src/app/servicios/carga-imagenes.service';
import { ToastrService } from 'ngx-toastr';
import { FileItem } from 'src/app/entidades/file-item';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {

  // asi... recogemos el parametro id del usuario que se ha enviado
  @Input() edit;
  public verNuevo = false;
  public cargando: Boolean = false;
  public fotoingresada = false;
  public usuario: Users;

  public imagen: string = null;
  public imagenAnterior: string = null; // solo se usara para editar usuario

  public estaSobreElemento = false;
  archivo: FileItem;
  file: File = null;

  constructor(
    private activeModal: NgbActiveModal,
    private _cargaImagenes: CargaImagenesService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService
  ) {
    // this.items = db.collection('usuarios').valueChanges();
    this.usuario = new Users();
    this.archivo = new FileItem(null);
    // this.archivos = [];
  }

  ngOnInit() {
    if (this.edit) {
      console.log('usuario_id: ' + this.edit);
      this.traerParaEdicion(this.edit);
    }
  }

  traerParaEdicion(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.verNuevo = false;
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
    if (!this.edit) { // guardar nuevo usuario
      if (this.archivo.archivo == null) { // el usuario guarda sin su foto
        console.log('usuario antes de guardar:');
        console.log(this.usuario);
      } else { // el usuario guarda con su foto
        console.log('inicio de guardar usuario');
        this.usuario.foto = this.archivo.url;
      }
      this.nuevoUsuario();
    } else { // editar usuario
      if (this.imagenAnterior === this.imagen) { // el usuario edita con su misma foto
        console.log('usuario antes de guardar:');
        console.log(this.usuario);
      } else { // el usuario cambio su foto
        this.usuario.foto = this.archivo.url;
      }
      this.editarUsuario();
    }
  }

  private nuevoUsuario() {
    // .-. nuevo
    console.log('procesando nuevo usuario ...');
    this.usuarioService.ingresarUsuario(this.usuario, this);
  }

  despuesDeIngresarUsuario(data) {
    console.log('usuario gaurdado: ');
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    // cierra el modal y adems pasa un parametro al componente que lo llamo a este modal usuario
    this.activeModal.close(this.usuario);
  }

  private editarUsuario() {
    console.log('editando usuario...');
    this.usuarioService.modificarUsuario(this.usuario, this);
  }

  despuesDeModificarUsuario(data) {
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    this.activeModal.close();
  }

  private handleError(error: any): void {
    this.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }
  // subir imagen en firebase (cloud storage)
  subirimagen() {
    if (!this.edit) { // para nuevo usuario
      this.cargarImagen();
      this.usuario.nombrefoto = this.archivo.nombreArchivo;
      console.log('usuario por ahora: ');
      console.log(this.usuario);
    } else { // para editar usuario
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
    }
  }
  /*para guardar las imagenes en storage firebase */
  detectarArchivo($event) {
    this.fotoingresada = true;
    this.archivo = null;
    this.file = $event.target.files[0];
    console.log('Detectar file:');
    console.log(this.file);
    this.archivo = new FileItem(this.file);
    console.log('Detectar archivo:');
    console.log(this.archivo);
    if ($event.target.files && $event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => { this.imagen = event.target.result; };
      reader.readAsDataURL($event.target.files[0]);
    }
  }

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

  limpiarArchivos() {
    this.archivo = null;
    // this.archivos = [];
  }

}
