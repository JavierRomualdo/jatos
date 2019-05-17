import { Component, OnInit, Input } from '@angular/core';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { UbigeoGuardar } from 'src/app/entidades/entidad.ubigeoguardar';
import { UbigeoTipo } from 'src/app/entidades/entidad.tipoubigeo';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/servicios/auth.service';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { UbigeoService } from './ubigeo.service';
import { TipoubigeoService } from '../modal-tipoubigeo/tipoubigeo.service';
import { NgForm } from '@angular/forms';
import { UtilService } from 'src/app/servicios/util/util.service';
import { HabilitacionUrbana } from 'src/app/entidades/entidad.habilitacionurbana';
import { HabilitacionurbanaService } from '../../habilitacionurbana/habilitacionurbana.service';

@Component({
  selector: 'app-modal-ubigeo',
  templateUrl: './modal-ubigeo.component.html',
  styleUrls: ['./modal-ubigeo.component.css']
})
export class ModalUbigeoComponent implements OnInit {

  @Input() edit;
  @Input() nivelTipoUbigeo: number = 3; // establecemos si este componente es modal o no    
  public ubigeo: Ubigeo;
  public ubigeoGuardar: UbigeoGuardar;
  public vistaFormulario = false;
  public cargando: Boolean = false;
  public verNuevo: Boolean = false;
  public confirmarcambioestado: Boolean = false;
  public ubigeodepartamentos: Ubigeo[];
  public departamentoSeleccionado: Ubigeo;
  public ubigeoprovincias: Ubigeo[];
  public provinciaSeleccionado: Ubigeo;
  public ubigeodistritos: Ubigeo[];
  public ubigeos: Ubigeo[]; // son ubigeos de distritos que muestra en la tabla
  public ubigeosCopia: Ubigeo[];
  public distritoSeleccionado: Ubigeo;
  public tipoubigeos: UbigeoTipo[];
  public idTipoUbigeo: number = 0;
  public parametros: UbigeoGuardar;
  public listaHabilitacionUrbana: HabilitacionUrbana[];
  public habilitacionurbanaSelecionado: HabilitacionUrbana;
  public seleccionoFila: boolean = false;

  public listado: Boolean = false;
  
  constructor(
    public activeModal: NgbActiveModal,
    private ubigeoService: UbigeoService,
    private tipoUbigeoService: TipoubigeoService,
    private habilitacionurbanaService: HabilitacionurbanaService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private modal: NgbModal,
    private auth: AuthService
  ) {
    this.ubigeo = new Ubigeo();
    this.ubigeoGuardar = new UbigeoGuardar();
    this.ubigeoGuardar.ubigeo = new Ubigeo();
    this.ubigeodepartamentos = [];
    this.departamentoSeleccionado = undefined;
    this.ubigeoprovincias = [];
    this.provinciaSeleccionado = undefined;
    this.ubigeos = [];
    this.ubigeosCopia = [];
    this.ubigeodistritos = [];
    this.distritoSeleccionado = undefined;
    this.tipoubigeos = [];
    this.listaHabilitacionUrbana = [];
    this.habilitacionurbanaSelecionado = undefined;
    // this.parametros = new Ubigeo();
    this.parametros = new UbigeoGuardar();
    this.parametros.departamento = null;
    this.parametros.provincia = null;
    this.parametros.ubigeo = new Ubigeo();
  }

  ngOnInit() {
    if (this.edit) {
      this.traerParaEdicion(this.edit);
    } else {
      this.listarUbigeos(); // index ubigeos (departamento)
    }
    // por defecto se debe listar tipoubigeo 1 (departamentos)
  }

  busqueda(form: NgForm): void {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      this.cargando = true;
      this.ubigeoService.busquedaUbigeos(this.parametros, this);
    } else {
      this.toastr.warning('Verifique los datos ingresados.', 'Datos inválidos');
    }
  }

  despuesDeBusquedaUbigeos(data) {
    console.log(data);
    this.ubigeos = data;
    this.cargando = false;
    this.vistaFormulario = false;
    this.verNuevo = false;
  }

  mostrarprovincias(departamentoSeleccionado) {
    this.parametros.departamento = departamentoSeleccionado;
    this.seleccionoFila = departamentoSeleccionado.tipoubigeo_id==this.nivelTipoUbigeo - 1;
    console.log(departamentoSeleccionado);
    this.mostrarubigeos(departamentoSeleccionado.tipoubigeo_id, departamentoSeleccionado.codigo);
  }

  mostrardistritos(provinciaSeleccionado) {
    this.parametros.provincia = provinciaSeleccionado;
    this.seleccionoFila = provinciaSeleccionado.tipoubigeo_id==this.nivelTipoUbigeo - 1;
    console.log(provinciaSeleccionado);
    this.mostrarubigeos(provinciaSeleccionado.tipoubigeo_id, provinciaSeleccionado.codigo);
  }

  mostrarHabilitacionesUrbanas(distritoSeleccionado) {
    this.parametros.distrito = distritoSeleccionado;
    this.seleccionoFila = distritoSeleccionado.tipoubigeo_id==this.nivelTipoUbigeo - 1;
    console.log(distritoSeleccionado);
    this.mostrarubigeos(distritoSeleccionado.tipoubigeo_id, distritoSeleccionado.codigo);
  }

  limpiar() {
    this.parametros = new UbigeoGuardar();
    this.parametros.departamento = null;
    this.parametros.provincia = null;
    this.parametros.ubigeo = new Ubigeo();

    this.ubigeos = [];
    this.ubigeoprovincias = [];
    this.ubigeodistritos = [];
    this.listaHabilitacionUrbana = [];
    this.departamentoSeleccionado = undefined;
    this.provinciaSeleccionado = undefined;
    this.distritoSeleccionado = undefined;
    this.habilitacionurbanaSelecionado=undefined;
    this.listarUbigeos();
  }

  nuevo() {
    this.vistaFormulario = true;
    this.verNuevo = true;
    this.idTipoUbigeo = 0;
    this.departamentoSeleccionado = undefined;
    this.provinciaSeleccionado = undefined;
    this.distritoSeleccionado = undefined;
    this.habilitacionurbanaSelecionado = undefined;
    this.ubigeoprovincias = [];
    this.ubigeodistritos = [];
    this.listaHabilitacionUrbana = [];
    this.ubigeoGuardar.ubigeo = new Ubigeo();
    this.ubigeoGuardar.ubigeo.habilitacionurbana_id = new HabilitacionUrbana();
    this.ubigeo = new Ubigeo();
    this.listarTipoUbigeos();
  }

  listarUbigeos() {
    this.cargando = true;
    this.ubigeoService.litarUbigeos(this);
  }

  despuesDeListarUbigeos(data) {
    this.ubigeodepartamentos = data;
    this.ubigeos = data;
    this.ubigeosCopia = data;
    this.cargando = false;
    console.log(data);
  }

  mostrarubigeos(idtipoubigeo, codigo) {
    this.cargando = true;
    let parametros = {idtipoubigeo: idtipoubigeo, codigo: codigo};
    this.ubigeoService.mostrarUbigeos(parametros, this);
  }

  despuesDeMostrarUbigeosProvincias(data) {
    this.cargando = false;
    this.ubigeoprovincias = data;
    this.ubigeos = this.ubigeoprovincias;
  }

  despuesDeMostrarUbigeosDistritos(data) {
    this.cargando = false;
    this.ubigeodistritos = data;
    this.ubigeos = data; // distritos
  }

  despuesDeMostrarUbigeosHabilitacionUrbanas(data){
    this.cargando = false;
    this.listaHabilitacionUrbana = data;
    this.ubigeos = data; // distritos
  }

  listarTipoUbigeos() {
    this.cargando = true;
    this.tipoUbigeoService.listarTipoUbigeos(this);
  }

  despuesDeListarTipoUbigeos(data) {
    this.tipoubigeos = data;
    this.cargando = false;
    console.log(data);
  }

  listarHabilitacionUrbana(activos) {
    this.cargando = true;
    let parametros = {
      activos: activos
    }
    this.habilitacionurbanaService.listarHabilitacionUrbana(parametros, this);
  }

  despuesDeListarHabilitacionUrbana(data) {
    this.listaHabilitacionUrbana = data;
    this.cargando = false;
    console.log(data);
  }

  traerParaEdicion(id) {
    this.listarTipoUbigeos();
    this.vistaFormulario = true;
    this.verNuevo = false;
    this.cargando = true;
    this.ubigeoService.mostrarUbigeo(id, this);
  }

  despuesDeMostrarUbigeo(data) {
    console.log(data);
    this.ubigeoGuardar.ubigeo = data.ubigeo;
    this.idTipoUbigeo = this.ubigeoGuardar.ubigeo.tipoubigeo_id.id;
    if (data.departamento != null) {
      this.ubigeoGuardar.departamento = data.departamento;
    }
    if (data.provincia != null) {
      this.ubigeoGuardar.departamento = data.departamento;
      this.ubigeoGuardar.provincia = data.provincia;
    }
    if (data.distrito != null) {
      this.ubigeoGuardar.departamento = data.departamento;
      this.ubigeoGuardar.provincia = data.provincia;
      this.ubigeoGuardar.distrito = data.distrito;
      console.log("mira:", this.provinciaSeleccionado, this.distritoSeleccionado);
      this.listarHabilitacionUrbana(true);
      this.habilitacionurbanaSelecionado = this.ubigeoGuardar.ubigeo.habilitacionurbana_id;
    }
    this.cargando = false;
  }

  guardarUbigeo(form: NgForm) {
    this.cargando = true;
    if (this.idTipoUbigeo === 1) { // departamento
      this.ubigeoGuardar.departamento = null;
      this.ubigeoGuardar.provincia = null;
      this.ubigeoGuardar.ubigeo.rutaubigeo = this.ubigeoGuardar.ubigeo.ubigeo;
    } else if (this.idTipoUbigeo === 2) {
      this.ubigeoGuardar.departamento = this.departamentoSeleccionado;
      this.ubigeoGuardar.ubigeo.rutaubigeo = this.departamentoSeleccionado.ubigeo+", "+
          this.ubigeoGuardar.ubigeo.ubigeo; // formamos la ruta del ubigeo
    } else if (this.idTipoUbigeo === 3) {
      this.ubigeoGuardar.departamento = this.departamentoSeleccionado;
      this.ubigeoGuardar.provincia = this.provinciaSeleccionado;
      this.ubigeoGuardar.ubigeo.rutaubigeo = this.departamentoSeleccionado.ubigeo+", "+
        this.provinciaSeleccionado.ubigeo+", "+ this.ubigeoGuardar.ubigeo.ubigeo;
    } else if (this.idTipoUbigeo === 4) {
      this.ubigeoGuardar.departamento = this.departamentoSeleccionado;
      this.ubigeoGuardar.provincia = this.provinciaSeleccionado;
      this.ubigeoGuardar.distrito = this.distritoSeleccionado;
      this.ubigeoGuardar.ubigeo.rutaubigeo = this.departamentoSeleccionado.ubigeo+", "+
        this.provinciaSeleccionado.ubigeo+", "+ this.distritoSeleccionado.ubigeo+ ", "+
        this.ubigeoGuardar.ubigeo.ubigeo; // formamos la ruta del ubigeo
      this.ubigeoGuardar.ubigeo.habilitacionurbana_id = this.habilitacionurbanaSelecionado;
    }

    for (const tipoubigeo of this.tipoubigeos) {
      if (tipoubigeo.id === this.idTipoUbigeo) {
        this.ubigeoGuardar.ubigeo.tipoubigeo_id = tipoubigeo;
      }
    }
    if (!this.ubigeoGuardar.ubigeo.id) { // guardar nuevo ubigeo
      console.log('antes de guardar:');
      console.log(this.ubigeoGuardar);
      this.ubigeoService.ingresarUbigeo(this.ubigeoGuardar, this);
    } else { // guardar el ubigeo editado
      console.log('antes de editar:');
      console.log(this.ubigeoGuardar);
      this.ubigeoService.modificarUbigeo(this.ubigeoGuardar, this);
    }
    this.departamentoSeleccionado = undefined;
    this.provinciaSeleccionado = undefined;
    this.distritoSeleccionado = undefined;
    this.ubigeoprovincias = [];
    this.ubigeodistritos = [];
    this.ubigeoGuardar = new UbigeoGuardar();
    this.ubigeoGuardar.ubigeo = new Ubigeo();
  }

  despuesDeIngresarUbigeo(data) {
    console.log(data);
    this.cargando = false;
    this.vistaFormulario = false;
    this.verNuevo = false;
    this.listarUbigeos();
  }

  despuesDeModificarUbigeo(data) {
    console.log(data);
    this.cargando = false;
    this.vistaFormulario = false;
    this.verNuevo = false;
    this.listarUbigeos();
  }

  confirmarcambiodeestado(ubigeo): void {
    const modalRef = this.modal.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoubigeo(ubigeo);
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      ubigeo.estado = !ubigeo.estado;
      this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoubigeo(ubigeo) {
    this.cargando = true;
    this.ubigeoService.cambiarEstadoUbigeo(ubigeo.id, this);
  }

  despuesDeCambiarEstadoUbigeo(data) {
    console.log(data);
    this.listarUbigeos();
    this.cargando = false;
  }

  cerrarFormulario() {
    this.vistaFormulario = false;
    this.departamentoSeleccionado = undefined;
    this.ubigeoprovincias = [];
    this.provinciaSeleccionado = undefined;
    this.distritoSeleccionado = undefined;
    this.listarUbigeos();
  }

  enviarubigeo(ubigeo: Ubigeo) {
    this.parametros.ubigeo = ubigeo;
    this.activeModal.close(this.parametros);
  }

  paginate(event) {
    this.ubigeos = this.ubigeosCopia.slice(event.first, event.first+event.rows);
  }
}
