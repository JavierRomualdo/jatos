import { Component, OnInit, Input } from '@angular/core';
import { Apartamento } from 'src/app/entidades/entidad.apartamento';
import { FileItem } from 'src/app/entidades/file-item';
import { Servicios } from 'src/app/entidades/entidad.servicios';
import { Apartamentoservicio } from 'src/app/entidades/entidad.apartamentoservicio';
import { Foto } from 'src/app/entidades/entidad.foto';
import { UbigeoGuardar } from 'src/app/entidades/entidad.ubigeoguardar';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CargaImagenesService } from 'src/app/servicios/carga-imagenes.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/servicios/auth.service';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { ModalUbigeoComponent } from '../../../configuracion/ubigeo/modal-ubigeo/modal-ubigeo.component';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { ApartamentoService } from '../apartamento.service';
import { FotosService } from 'src/app/servicios/fotos/fotos.service';
import { LS } from 'src/app/contantes/app-constants';
import { ApartamentoTO } from 'src/app/entidadesTO/empresa/ApartamentoTO';
import { ServiciosComponent } from '../../../configuracion/servicios/servicios.component';

@Component({
  selector: 'app-modal-apartamento',
  templateUrl: './modal-apartamento.component.html',
  styleUrls: ['./modal-apartamento.component.css']
})
export class ModalApartamentoComponent implements OnInit {

  @Input() parametros;
  @Input() isModal: boolean; // establecemos si este componente es modal o no 
  public verNuevo = false;
  public cargando: Boolean = false;
  public apartamento: Apartamento;
  public archivos: FileItem[] = [];
  public servicios: Servicios[];
  public apartamentoservicios: Apartamentoservicio[];
  public fotos: Foto[];
  public ubigeo: UbigeoGuardar;
  public accion: string = null;
  public tituloForm: string = null;
  public constantes: any = LS;
  public parametrosFoto: any = null;

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _cargaImagenes: CargaImagenesService,
    private apartamentoService: ApartamentoService,
    private fotosService: FotosService,
    private toastr: ToastrService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.apartamento = new Apartamento();
    this.fotos = [];
    this.servicios = [];
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.archivos = [];
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
          this.tituloForm = LS.TITULO_FORM_CONSULTAR_APARTAMENTO;
          this.despuesDeMostrarApartamento(this.parametros.apartamento);
          // this.traerParaEdicion(this.parametros.idCochera);
          break;
        case LS.ACCION_EDITAR:
          this.tituloForm = LS.TITULO_FORM_NUEVO_APARTAMENTO;
          this.despuesDeMostrarApartamento(this.parametros.apartamento);
          // this.traerParaEdicion(this.parametros.idCochera);
          break;
        case LS.ACCION_NUEVO:
          if (this.isModal) {
            this.tituloForm = LS.TITULO_FORM_NUEVO_APARTAMENTO;
            this.postGuardarApartamento();
          } else {
            this.tituloForm = LS.TITULO_FORM_CONSULTAR_APARTAMENTO;
          }
          break;
      }
    }
  }

  guardarapartamento() {
    console.log('vamos a guardar una apartamento');
    this.cargando = true;
    this.apartamento.ubigeo_id = this.ubigeo.ubigeo;
    this.apartamento.serviciosList = this.servicios;
    if (this.accion === LS.ACCION_NUEVO) { // guardar nueva apartamento
      // guardar en lista fotos
      for (const item of this.archivos) {
        const foto: Foto = new Foto();
        foto.nombre = item.nombreArchivo;
        foto.foto = item.url;
        foto.detalle = item.detalle;
        this.fotos.push(foto);
      }
      this.apartamento.fotosList = this.fotos;
      this.fotos = [];
      console.log('fotos: ');
      console.log(this.apartamento.fotosList);
      this.apartamento.ganancia = this.apartamento.preciocontrato - this.apartamento.precioadquisicion;
      console.log('antes de guardar apartamento: ');
      console.log(this.apartamento);
      this.apartamentoService.ingresarApartamento(this.apartamento, this);
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
      this.apartamento.fotosList = fotos;
      this.apartamento.apartamentoservicioList = this.apartamentoservicios;
      fotos = [];
      console.log('fotos: ');
      console.log(this.apartamento.fotosList);
      this.apartamento.ganancia = this.apartamento.preciocontrato - this.apartamento.precioadquisicion;
      console.log('antes de editar apartamento: ');
      console.log(this.apartamento);
      this.apartamentoService.modificarApartamento(this.apartamento, this);
    }
  }

  despuesDeIngresarApartamento(data) {
    console.log('se guardo estos datos: ');
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    let apartamentoTO = this.convertirAparatamentoAApartamentoTO(data); // sirve para actualizar la tabla
    // luego se guarda las fotos. vale hacer eso en la sgt version
    this.activeModal.close(apartamentoTO);
  }

  convertirAparatamentoAApartamentoTO(data) {
    let apartamentoTO = new ApartamentoTO(data);
    apartamentoTO.ubicacion = this.apartamento.ubigeo_id.ubigeo;
    return apartamentoTO;
  }

  despuesDeModificarApartamento(data) {
    console.log(data);
    this.cargando = false;
    this.verNuevo = false;
    let apartamentoTO = this.convertirAparatamentoAApartamentoTO(data); // sirve para actualizar la tabla
    this.activeModal.close(apartamentoTO);
  }

  traerParaEdicion(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.verNuevo = true;
    this.cargando = true;
    this.apartamentoService.mostrarApartamento(id,this);
  }

  despuesDeMostrarApartamento(data) {
    // console.log(res);
    this.apartamento = data;
    this.ubigeo = data.ubigeo;
    this.servicios = data.serviciosList;
    this.apartamentoservicios = data.apartamentoservicioList;

    for (const item of data.fotosList) {
      console.log('foto: ');
      console.log(item);
      this.fotos.push(item);
    }
    console.log('fotoss : ');
    console.log(this.fotos);
    // this.fotos = res.fotosList;
    console.log('traido para edicion');
    console.log(this.apartamento);
    this.apartamento.fotosList = {}; // tiene que ser vacio xq son la lista de imagenes nuevas pa agregarse
    // traer archivos de firebase storage
    // this._cargaImagenes.getImagenes(res.path);

    // aqui metodo para mostrar todas las imagenes de este apartamento ....
    // this.imagen = res.foto;
    // this.imagenAnterior = res.foto;
    this.cargando = false;
  }

  buscarubigeo() {
    const modalRef = this.modalService.open(ModalUbigeoComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
      console.log('ubigeoguardar:');
      console.log(result);
      this.ubigeo = result;
      this.apartamento.ubigeo_id = result.ubigeo;
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  buscarservicio() {
    const modalRef = this.modalService.open(ServiciosComponent, {size: 'lg', keyboard: true});
    modalRef.componentInstance.isModal = true;
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

  postGuardarApartamento() {
    // se genera el codigode la cochera cuando la accion es nuevo
    this.cargando = true;
    this.apartamentoService.generarCodigoApartamento(this);
  }

  despuesDeGenerarCodigoApartamento(data) {
    this.cargando = false;
    this.apartamento.codigo = data;
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
      this.apartamento.path = 'apartamentos/' + this.apartamento.id;
      this._cargaImagenes.cargarImagenesFirebase(this.apartamento.path, this.archivos);
    } else {
      this.toastr.info('Ya esta asignado');
    }
  }

  limpiarArchivos() {
    this.archivos = [];
  }

  limpiarapartamento() {
    // limpiar persona
    this.apartamento.ubigeo_id = new Ubigeo();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    // limpiar foto
    this.apartamento.foto = null;
    // limpiar servicios
    this.servicios = [];
    this.apartamentoservicios = [];
    this.apartamento.serviciosList = {};
    this.apartamento.apartamentoservicioList = {};
  }

  quitarservicio(servicio: Servicios) {
    const index = this.servicios.indexOf(servicio);
    this.servicios.splice(index, 1);
    // eliminamos en apartamentoservicios
    let i = 0;
    for (const apartamentoservicio of this.apartamentoservicios) {
      if (servicio.id === apartamentoservicio.servicio_id) {
        this.apartamentoservicios.splice(i, 1);
      }
      i++;
    }
    // this.apartamentoservicios.splice(index, 1);
    console.log('los servicios quedan: ');
    console.log(this.servicios);
    console.log('los apartamentoservicios quedad');
    console.log(this.apartamentoservicios);
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
  //
  quitarfotoapartamento(foto: Foto) {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      // elimino de la bd
      this.eliminarfotoapartamento(foto);
      // elimino de firebase storage
      this._cargaImagenes.deleteArchivo(this.apartamento.path, foto.nombre);
      if (this.apartamento.foto === foto.foto) {
        this.apartamento.foto = null;
      }
      this.toastr.success(result.operacionMensaje, 'Exito');
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  eliminarfotoapartamento(foto: Foto) {
    this.apartamentoService.eliminarFotoApartamento(foto, this);
  }

  despuesDeEliminarFotoApartamento(data) {
    console.log('se ha eliminado:');
    console.log(data);
  }

  mostrarFotoPrincipal(item: FileItem) {
    if (item.progreso >= 100 ) {
      this.apartamento.foto = item.url;
    }
  }

  mostrarFotoPrincipalExistente(foto: Foto) {
    this.apartamento.foto = foto.foto;
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
}
