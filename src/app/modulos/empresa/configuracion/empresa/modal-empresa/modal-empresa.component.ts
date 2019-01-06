import { Component, OnInit } from '@angular/core';
import { FileItem } from 'src/app/entidades/file-item';
import { Empresa } from 'src/app/entidades/entidad.empresa';
import { UbigeoGuardar } from 'src/app/entidades/entidad.ubigeoguardar';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/servicios/auth.service';
import { CargaImagenesService } from 'src/app/servicios/carga-imagenes.service';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { ModalUbigeoComponent } from '../../ubigeo/modal-ubigeo/modal-ubigeo.component';
import { EmpresaService } from './empresa.service';

@Component({
  selector: 'app-modal-empresa',
  templateUrl: './modal-empresa.component.html',
  styleUrls: ['./modal-empresa.component.css']
})
export class ModalEmpresaComponent implements OnInit {

  public fotoingresada = false;
  public cargando: Boolean = false;
  public archivo: FileItem;
  public file: File = null;
  public imagen: string = null;
  public imagenAnterior: string = null; // solo se usara para editar usuario
  public empresa: Empresa;
  public ubigeo: UbigeoGuardar;

  constructor(
    public activeModal: NgbActiveModal,
    private empresaService: EmpresaService,
    private modalService: NgbModal,
    private auth: AuthService,
    private _cargaImagenes: CargaImagenesService,
  ) {
    this.empresa = new Empresa();
    this.empresa.ubigeo_id = new Ubigeo();
    this.archivo = new FileItem(null);

    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
  }

  ngOnInit() {
    this.traerParaEdicion();
  }

  traerParaEdicion() {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.cargando = true;
    this.empresaService.listarEmpresa(this);
  }

  despuesDeListarEmpresa(data) {
    this.empresa = data;
    this.ubigeo = data.ubigeo;
    this.imagen = data.foto;
    this.imagenAnterior = data.foto;
    this.cargando = false;
  }

  guardarEmpresa() {
    this.cargando = true;
    this.empresa.ubigeo_id = this.ubigeo.ubigeo;
    // this.imagenAnterior es un parametro que tambien se podra visualizar si es nuevo o editar empresa
    if (this.imagenAnterior === undefined) { // nueva empresa undefined
      if (this.archivo.archivo !== null) { // el usuario guarda con su foto
        this.empresa.foto = this.archivo.url;
      }
      this.cargando = true;
      this.empresaService.ingresarEmpresa(this.empresa, this);
    } else { // editar empresa
      if (this.imagenAnterior !== this.imagen) { // la empresa cambio de icono
        this.empresa.foto = this.archivo.url;
      }
      this.cargando = true;
      this.empresaService.modificarEmpresa(this.empresa, this);
    }
  }

  despuesDeIngresarEmpresa(data) {
    this.cargando = false;
    // cierra el modal y adems pasa un parametro al componente que lo llamo a este modal usuario
    this.activeModal.close(this.empresa);
  }

  despuesDeModificarEmpresar(data) {
    this.cargando = false;
    this.activeModal.close();
  }

  subirimagen() {
    if (this.imagenAnterior !== this.imagen) { // la imagen es diferente
      // entonces se elimina la antigua y se sube una nueva imagen
      if (this.empresa.nombrefoto !== null) {
        this._cargaImagenes.deleteArchivo('empresa', this.empresa.nombrefoto);// foto antigua
      }
      this.cargarImagen();
      this.empresa.nombrefoto = this.archivo.nombreArchivo;
    }
  }

  /*para guardar las imagenes en storage firebase */
  detectarArchivo($event) {
    this.fotoingresada = true;
    this.archivo = null;
    this.file = $event.target.files[0]; // detectar file
    this.archivo = new FileItem(this.file); // detectar archivo
    if ($event.target.files && $event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => { this.imagen = event.target.result; };
      reader.readAsDataURL($event.target.files[0]);
    }
  }

  buscarubigeo() {
    const modalRef = this.modalService.open(ModalUbigeoComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
      this.ubigeo = result;
      this.empresa.ubigeo_id = result.ubigeo;
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  cargarImagen() {
    // el primer parametro es el nombre de la carpeta que le vamos bueno el nombre de la carpeta
    // lo vamos a ponerle al nombre del usuario y el segundo parametro su imagen para almacenar
    // en firebase (storage (aca se sube el archivo completo) y firestore (aca se registra el archivo en la bd))
    this._cargaImagenes.cargarImagen('empresa', this.archivo);
    // this._cargaImagenes.cargarImagen('usuarios/', this.archivos[0]); // +  this.usuario.name
  }

  limpiarempresa() {
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
  }
}
