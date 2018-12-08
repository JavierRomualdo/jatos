import { Component, OnInit, Input } from '@angular/core';
import { Cochera } from 'src/app/entidades/entidad.cochera';
import { FileItem } from 'src/app/entidades/file-item';
import { Servicios } from 'src/app/entidades/entidad.servicios';
import { Cocheraservicio } from 'src/app/entidades/entidad.cocheraservicio';
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
import { CocheraService } from '../cochera.service';
import { FotosService } from 'src/app/servicios/fotos/fotos.service';

@Component({
  selector: 'app-modal-cochera',
  templateUrl: './modal-cochera.component.html',
  styleUrls: ['./modal-cochera.component.css']
})
export class ModalCocheraComponent implements OnInit {

  @Input() edit;
  public verNuevo = false;
  public cargando: Boolean = false;
  public cochera: Cochera;
  public archivos: FileItem[] = [];
  public servicios: Servicios[];
  public cocheraservicios: Cocheraservicio[];
  public fotos: Foto[];
  public persona: Persona;
  public ubigeo: UbigeoGuardar;
  public listaLP: any = []; // lista de persona-roles

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _cargaImagenes: CargaImagenesService,
    private cocheraService: CocheraService,
    private fotosService: FotosService,
    private toastr: ToastrService,
    private auth: AuthService
  ) {
    this.cochera = new Cochera();
    this.fotos = [];
    this.servicios = [];
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

  guardarcochera() {
    console.log('vamos a guardar una cochera');
    this.cargando = true;
    this.cochera.cocherapersonaList = this.listaLP;
    this.cochera.persona_id = this.listaLP[0]; // this.listaPR[0].idrol
    this.cochera.ubigeo_id = this.ubigeo.ubigeo;
    this.cochera.serviciosList = this.servicios;
    if (!this.edit) {
      // guardar nueva cochera
      // guardar en lista fotos
      for (const item of this.archivos) {
        const foto: Foto = new Foto();
        foto.nombre = item.nombreArchivo;
        foto.foto = item.url;
        foto.detalle = item.detalle;
        this.fotos.push(foto);
      }
      this.cochera.fotosList = this.fotos;
      this.fotos = [];
      console.log('fotos: ');
      console.log(this.cochera.fotosList);
      console.log('antes de guardar cochera: ');
      console.log(this.cochera);
      this.cocheraService.ingresarCochera(this.cochera, this);
    } else {
      // guardar el rol editado
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
      this.cochera.fotosList = fotos;
      this.cochera.cocheraservicioList = this.cocheraservicios;
      fotos = [];
      console.log('fotos: ');
      console.log(this.cochera.fotosList);
      console.log('antes de editar cochera: ');
      console.log(this.cochera);
      this.cocheraService.modificarCochera(this.cochera, this);
    }
  }

  despuesDeIngresarCochera(data) {
    console.log('se guardo estos datos: ');
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    this.activeModal.close(this.cochera);
  }

  despuesDeModificarCochera(data) {
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    this.activeModal.close(this.cochera);
  }

  traerParaEdicion(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.verNuevo = true;
    this.cargando = true;
    this.cocheraService.mostrarCochera(id, this);
  }

  despuesDeMostrarCochera(data) {
    // console.log(data);
    this.cochera = data;
    this.listaLP = data.cocherapersonaList;
    this.persona = this.listaLP[0];
    this.ubigeo = data.ubigeo;
    this.servicios = data.serviciosList;
    this.cocheraservicios = data.cocheraservicioList;

    for (const item of data.fotosList) {
      console.log('foto: ');
      console.log(item);
      this.fotos.push(item);
    }
    console.log('fotoss : ');
    console.log(this.fotos);
    // this.fotos = res.fotosList;
    console.log('traido para edicion');
    console.log(this.cochera);
    this.cochera.fotosList = {}; // tiene que ser vacio xq son la lista de imagenes nuevas pa agregarse
    // traer archivos de firebase storage
    // this._cargaImagenes.getImagenes(res.path);

    // aqui metodo para mostrar todas las imagenes de este cochera ....
    // this.imagen = res.foto;
    // this.imagenAnterior = res.foto;
    this.cargando = false;
  }

  buscarpropietario() {
    const modalRef = this.modalService.open(ModalPersonaComponent, {
      size: 'lg',
      keyboard: true
    });
    modalRef.result.then(
      result => {
        this.persona = result;
        this.cochera.persona_id = result;
        this.listaLP[0] = result;
        this.auth.agregarmodalopenclass();
      },
      reason => {
        this.auth.agregarmodalopenclass();
      }
    );
  }

  buscarubigeo() {
    const modalRef = this.modalService.open(ModalUbigeoComponent, {
      size: 'lg',
      keyboard: true
    });
    modalRef.result.then(
      result => {
        console.log('ubigeoguardar:');
        console.log(result);
        this.ubigeo = result;
        this.cochera.ubigeo_id = result.ubigeo;
        this.auth.agregarmodalopenclass();
      },
      reason => {
        this.auth.agregarmodalopenclass();
      }
    );
  }

  buscarservicio() {
    const modalRef = this.modalService.open(ModalServicioComponent, {
      size: 'lg',
      keyboard: true
    });
    modalRef.result.then(
      result => {
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
      },
      reason => {
        this.auth.agregarmodalopenclass();
      }
    );
  }

  cargarImagenes() {
    let estadetalle: Boolean = true;
    for (const item of this.archivos) {
      if (
        item.detalle === '' ||
        item.detalle === null ||
        item.detalle === undefined
      ) {
        // aqui falta el detalle (input type text) del archivo que obligatoriamente debe tener contenido
        estadetalle = false;
      }
    }
    if (estadetalle) {
      this.cochera.path = 'cocheras/' + this.persona.dni;
      this._cargaImagenes.cargarImagenesFirebase(this.cochera.path, this.archivos);
    } else {
      this.toastr.info('Ya esta asignado');
    }
  }

  limpiarArchivos() {
    this.archivos = [];
  }

  limpiarcochera() {
    // limpiar persona
    this.persona = new Persona();
    this.cochera.persona_id = new Persona();
    this.cochera.ubigeo_id = new Ubigeo();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.listaLP = [];
    // limpiar foto
    this.cochera.foto = null;
    // limpiar servicios
    this.servicios = [];
    this.cocheraservicios = [];
    this.cochera.serviciosList = {};
    this.cochera.cocheraservicioList = {};
  }

  quitarservicio(servicio: Servicios) {
    const index = this.servicios.indexOf(servicio);
    this.servicios.splice(index, 1);
    // eliminamos en cocheraservicios
    let i = 0;
    for (const cocheraservicio of this.cocheraservicios) {
      if (servicio.id === cocheraservicio.servicio_id) {
        this.cocheraservicios.splice(i, 1);
      }
      i++;
    }
    // this.cocheraservicios.splice(index, 1);
    console.log('los servicios quedan: ');
    console.log(this.servicios);
    console.log('los cocheraservicios quedad');
    console.log(this.cocheraservicios);
  }

  quitarfoto(item: FileItem) {
    const index = this.archivos.indexOf(item);
    this.archivos.splice(index, 1);
    console.log('las fotos que quedan: ');
    console.log(this.archivos);
  }

  guardardetallefoto(foto: Foto) {
    console.log('salio del foco"');
    this.fotosService.ingresarDetalleFoto(foto, this);
  }

  despuesDeIngresarDetalleFoto(data) {
    console.log('se ha modificado foto:');
    console.log(data);
  }
  //
  quitarfotocochera(foto: Foto) {
    const modalRef = this.modalService.open(ConfirmacionComponent, {
      windowClass: 'nuevo-modal',
      size: 'sm',
      keyboard: false
    });
    modalRef.result.then(
      result => {
        // elimino de la bd
        this.eliminarfotocochera(foto);
        // elimino de firebase storage
        this._cargaImagenes.deleteArchivo(this.cochera.path, foto.nombre);
        if (this.cochera.foto === foto.foto) {
          this.cochera.foto = null;
        }
        this.toastr.success(result.operacionMensaje, 'Exito');
        this.auth.agregarmodalopenclass();
      },
      reason => {
        this.auth.agregarmodalopenclass();
      }
    );
  }

  eliminarfotocochera(foto: Foto) {
    this.cocheraService.eliminarFotoCochera(foto, this);
  }

  despuesDeEliminarFotoCochera(data) {
    console.log('se ha eliminado:');
    console.log(data);
  }

  mostrarFotoPrincipal(item: FileItem) {
    if (item.progreso >= 100) {
      this.cochera.foto = item.url;
    }
  }

  mostrarFotoPrincipalExistente(foto: Foto) {
    this.cochera.foto = foto.foto;
  }
}
