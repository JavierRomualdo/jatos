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
import { ModalPersonaComponent } from '../../../configuracion/empresa/modal-persona/modal-persona.component';
import { ModalUbigeoComponent } from '../../../configuracion/ubigeo/modal-ubigeo/modal-ubigeo.component';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { LoteService } from '../lote.service';
import { FotosService } from 'src/app/servicios/fotos/fotos.service';

@Component({
  selector: 'app-modal-lote',
  templateUrl: './modal-lote.component.html',
  styleUrls: ['./modal-lote.component.css']
})
export class ModalLoteComponent implements OnInit {

  @Input() edit;
  public verNuevo = false;
  public cargando: Boolean = false;
  public lote: Lote;
  public archivos: FileItem[] = [];
  public fotos: Foto[];
  public persona: Persona;
  public listaLP: any = []; // lista de persona-roles
  public ubigeo: UbigeoGuardar;

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _cargaImagenes: CargaImagenesService,
    private loteService: LoteService,
    private fotosService: FotosService,
    private toastr: ToastrService,
    private auth: AuthService
  ) {
    this.lote = new Lote();
    this.fotos = [];
    this.persona = new Persona();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.archivos = [];
    this.listaLP = [];
  }

  ngOnInit() {
    if (this.edit) {
      this.traerParaEdicion(this.edit);
    }
  }

  guardarlote() {
    console.log('vamos a guardar un lote');
    this.cargando = true;
    this.lote.lotepersonaList = this.listaLP;
    this.lote.persona_id = this.listaLP[0]; // this.listaPR[0].idrol
    this.lote.ubigeo_id = this.ubigeo.ubigeo;
    if (!this.edit) { // guardar nuevo rol
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
      console.log('antes de guardar lote: ');
      console.log(this.lote);
      this.loteService.ingresarLote(this.lote, this);
    } else { // guardar el rol editado
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
    this.activeModal.close(this.lote);
  }

  despuesDeModificarLote(data) {
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    this.activeModal.close(this.lote);
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
    const modalRef = this.modalService.open(ModalPersonaComponent, {size: 'lg', keyboard: true});
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
}
