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
import { ModalServicioComponent } from '../../../configuracion/empresa/modal-servicio/modal-servicio.component';
import { ModalPersonaComponent } from '../../../configuracion/empresa/modal-persona/modal-persona.component';
import { ModalUbigeoComponent } from '../../../configuracion/ubigeo/modal-ubigeo/modal-ubigeo.component';
import { CasasService } from '../casas.service';
import { FotosService } from 'src/app/servicios/fotos/fotos.service';

@Component({
  selector: 'app-modal-casa',
  templateUrl: './modal-casa.component.html',
  styleUrls: ['./modal-casa.component.css']
})
export class ModalCasaComponent implements OnInit {

  @Input() edit;
  public verNuevo = false;
  public cargando: Boolean = false;
  public casa: Casa;
  public archivos: FileItem[] = [];
  public servicios: Servicios[];
  public casaservicios: Casaservicio[];
  public fotos: Foto[];
  public persona: Persona;
  public ubigeo: UbigeoGuardar;
  public listaLP: any = []; // lista de persona-roles
  
  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _cargaImagenes: CargaImagenesService,
    private casasService: CasasService,
    private fotosService: FotosService,
    private toastr: ToastrService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // limpiar
    this.casa = new Casa();
    this.fotos = [];
    this.servicios = [];
    this.persona = new Persona();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.archivos = [];
    this.listaLP = [];
    if (this.edit) {
      this.traerParaEdicion(this.edit);
    }
  }

  guardarpropiedad() {
    console.log('vamos a guardar una propiedad');
    this.cargando = true;
    this.casa.casapersonaList = this.listaLP;
    this.casa.persona_id = this.listaLP[0]; // this.listaPR[0].idrol
    this.casa.ubigeo_id = this.ubigeo.ubigeo;
    this.casa.serviciosList = this.servicios;
    if (!this.edit) { // guardar nueva propiedad
      // guardar en lista fotos
      for (const item of this.archivos) {
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
      console.log('antes de guardar propiedad: ');
      console.log(this.casa);
      this.casasService.ingresarCasa(this.casa, this);
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
      this.casa.fotosList = fotos;
      this.casa.casaservicioList = this.casaservicios;
      fotos = [];
      console.log('fotos: ');
      console.log(this.casa.fotosList);
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
    this.activeModal.close(this.casa);
  }

  despuesDeModificarCasa(data) {
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    this.activeModal.close(this.casa);
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
      this.casa.persona_id = result;
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
      this.casa.ubigeo_id = result.ubigeo;
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

  cargarImagenes() {
    let estadetalle: Boolean = true;
    for (const item of this.archivos) {
      if (item.detalle === '' || item.detalle === null || item.detalle === undefined) {
        // aqui falta el detalle (input type text) del archivo que obligatoriamente debe tener contenido
        estadetalle = false;
      }
    }
    if (estadetalle) {
      this.casa.path = 'casas/' + this.persona.dni;
      this._cargaImagenes.cargarImagenesFirebase(this.casa.path, this.archivos);
    } else {
      this.toastr.info('Ya esta asignado');
    }
  }

  limpiarArchivos() {
    this.archivos = [];
  }

  limpiarpropiedad() {
    // limpiar persona
    this.persona = new Persona();
    this.casa.persona_id = new Persona();
    this.casa.ubigeo_id = new Ubigeo();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.listaLP = [];
    // limpiar foto
    this.casa.foto = null;
    // limpiar servicios
    this.servicios = [];
    this.casaservicios = [];
    this.casa.serviciosList = {};
    this.casa.casaservicioList = {};
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
}
