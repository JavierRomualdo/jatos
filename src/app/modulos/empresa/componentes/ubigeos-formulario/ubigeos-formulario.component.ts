import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LS } from 'src/app/contantes/app-constants';
import { UbigeoGuardar } from 'src/app/entidades/entidad.ubigeoguardar';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { UbigeoTipo } from 'src/app/entidades/entidad.tipoubigeo';
import { HabilitacionUrbana } from 'src/app/entidades/entidad.habilitacionurbana';
import { UbigeoService } from '../../configuracion/ubigeo/modal-ubigeo/ubigeo.service';
import { HabilitacionurbanaService } from '../../configuracion/habilitacionurbana/habilitacionurbana.service';
import { TipoubigeoService } from '../../configuracion/ubigeo/modal-tipoubigeo/tipoubigeo.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ubigeos-formulario',
  templateUrl: './ubigeos-formulario.component.html',
  styleUrls: ['./ubigeos-formulario.component.css']
})
export class UbigeosFormularioComponent implements OnInit {

  @Input() parametrosFormulario: any;
  @Output() enviarAccion = new EventEmitter();
  public ubigeoGuardar: UbigeoGuardar;
  public ubigeodepartamentos: Ubigeo[] = [];
  public departamentoSeleccionado: Ubigeo = null;
  public ubigeoprovincias: Ubigeo[] = [];
  public provinciaSeleccionado: Ubigeo = null;
  public ubigeodistritos: Ubigeo[] = [];
  public distritoSeleccionado: Ubigeo = null;
  public tipoubigeos: UbigeoTipo[];
  public listaHabilitacionUrbana: HabilitacionUrbana[] = [];
  public habilitacionurbanaSelecionado: HabilitacionUrbana = null;
  public parametros: UbigeoGuardar;
  public idTipoUbigeo: number = 0;
  public cargando: Boolean = false;
  public accion: string = null;
  public tituloForm: string = null;
  public constantes: any = LS;

  constructor(
    private ubigeoService: UbigeoService,
    private tipoUbigeoService: TipoubigeoService,
    private habilitacionurbanaService: HabilitacionurbanaService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.ubigeoGuardar = new UbigeoGuardar();
    this.ubigeoGuardar.ubigeo = new Ubigeo();
    this.tipoubigeos = [];
    // this.parametros = new Ubigeo();
    this.parametros = new UbigeoGuardar();
    this.parametros.departamento = null;
    this.parametros.provincia = null;
    this.parametros.ubigeo = new Ubigeo();
  }

  ngOnChanges(changes) {
    if (changes.parametrosFormulario) {
      if (changes.parametrosFormulario.currentValue) {
        this.accion = this.parametrosFormulario.accion;
        this.postIniciarVistaFormulario(this.accion);
      }
    }
  }

  postIniciarVistaFormulario(accion: string) {
    // titulo del formulario
    this.ubigeodepartamentos = this.parametrosFormulario.departamentos;
    this.ubigeodistritos = this.parametrosFormulario.distritos;
    this.ubigeoprovincias = this.parametrosFormulario.provincias;
    this.listaHabilitacionUrbana = this.parametrosFormulario.habilitacionurbanas;
    switch (accion) {
      case LS.ACCION_NUEVO:
        this.tituloForm = LS.TITULO_FORM_NUEVO_UBIGEO;
        this.listarTipoUbigeos();
        break;
      case LS.ACCION_EDITAR:
        this.tituloForm = LS.TITULO_FORM_EDITAR_UBIGEO;
        this.traerParaEdicion(this.parametrosFormulario.ubigeo);
        break;
      case LS.ACCION_CONSULTAR:
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_UBIGEO;
        this.traerParaEdicion(this.parametrosFormulario.ubigeo);
        break;
      default:
        break;
    }

  }

  traerParaEdicion(ubigeo: Ubigeo) {
    this.cargando = true;
    this.listarTipoUbigeos();
    this.ubigeoService.mostrarUbigeo(ubigeo.id, this);
  }

  despuesDeMostrarUbigeo(data) {
    console.log(data);
    this.ubigeoGuardar.ubigeo = data.ubigeo;
    this.idTipoUbigeo = this.ubigeoGuardar.ubigeo.tipoubigeo_id.id;
    if (data.departamento != null) {
      this.ubigeoGuardar.departamento = data.departamento;
      this.departamentoSeleccionado = data.departamento;
    }
    if (data.provincia != null) {
      this.ubigeoGuardar.departamento = data.departamento;
      this.ubigeoGuardar.provincia = data.provincia;
      this.departamentoSeleccionado = data.departamento;
      this.provinciaSeleccionado = data.provincia;
    }
    if (data.distrito != null) {
      this.ubigeoGuardar.departamento = data.departamento;
      this.ubigeoGuardar.provincia = data.provincia;
      this.ubigeoGuardar.distrito = data.distrito;
      this.departamentoSeleccionado = data.departamento;
      this.provinciaSeleccionado = data.provincia;
      this.distritoSeleccionado = data.distrito;

      console.log("mira:", this.provinciaSeleccionado, this.distritoSeleccionado);
      this.habilitacionurbanaSelecionado = this.ubigeoGuardar.ubigeo.habilitacionurbana_id;
      this.listarHabilitacionUrbana(true);
    }
    this.cargando = false;
  }

  guardarUbigeo() {
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
    if (this.accion === LS.ACCION_NUEVO) { // guardar nuevo ubigeo
      console.log('antes de guardar:');
      console.log(this.ubigeoGuardar);
      this.ubigeoService.ingresarUbigeo(this.ubigeoGuardar, this);
    } else { // guardar el ubigeo editado
      console.log('antes de editar:');
      console.log(this.ubigeoGuardar);
      this.ubigeoService.modificarUbigeo(this.ubigeoGuardar, this);
    }
    this.departamentoSeleccionado = null;
    this.provinciaSeleccionado = null;
    this.distritoSeleccionado = null;
    this.ubigeoprovincias = [];
    this.ubigeodistritos = [];
    this.ubigeoGuardar = new UbigeoGuardar();
    this.ubigeoGuardar.ubigeo = new Ubigeo();
  }

  despuesDeIngresarUbigeo(data) {
    console.log('se guardo estos datos: ');
    console.log(data);
    this.cargando = false;
    let parametros = { 
      accion: this.accion,
      ubigeo: new Ubigeo(data),
      tipoubigeo: this.idTipoUbigeo
    }
    this.enviarAccion.emit(parametros);
  }

  despuesDeModificarUbigeo(data) {
    console.log(data);
    this.cargando = false;
    let parametros = {
      accion: this.accion,
      ubigeo: new Ubigeo(data),
      tipoubigeo: this.idTipoUbigeo
    }
    this.enviarAccion.emit(parametros);
  }

  mostrarLosUbigeos(idTipoUbigeo: number) {
    console.log("idTipoUbigeo:", idTipoUbigeo);
    switch (idTipoUbigeo) {
      case 1:
        this.departamentoSeleccionado = null;
        break;
      case 2:
        this.ubigeoprovincias = [];
        this.departamentoSeleccionado = null;
        this.provinciaSeleccionado = null;
        break;
      case 3:
        this.ubigeoprovincias = [];
        this.ubigeodistritos = [];
        this.departamentoSeleccionado = null;
        this.provinciaSeleccionado = null;
        this.distritoSeleccionado = null;
        break;
      case 4:
        this.ubigeoprovincias = [];
        this.ubigeodistritos = [];
        this.departamentoSeleccionado = null;
        this.provinciaSeleccionado = null;
        this.distritoSeleccionado = null;
        this.habilitacionurbanaSelecionado = null;
        this.listarHabilitacionUrbana(true);
        break;
      default:
        console.error("error en el metodo mostrarLosUbigeos");
        break;
    }
  }

  mostrarprovincias(departamentoSeleccionado: Ubigeo) {
    console.log("departamentoSeleccionado: ", departamentoSeleccionado);
    if (departamentoSeleccionado) {
      this.parametros.departamento = departamentoSeleccionado;
      // this.seleccionoFila = departamentoSeleccionado.tipoubigeo_id==this.nivelTipoUbigeo - 1;
      console.log(departamentoSeleccionado);
      this.mostrarubigeos(departamentoSeleccionado.tipoubigeo_id, departamentoSeleccionado.codigo);
    } else {
      this.ubigeoprovincias = [];
      this.ubigeodistritos = [];
    }
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

  mostrardistritos(provinciaSeleccionado: Ubigeo) {
    console.log("provinciaSeleccionado: ", provinciaSeleccionado);
    if (provinciaSeleccionado) {
      this.parametros.provincia = provinciaSeleccionado;
      // this.seleccionoFila = provinciaSeleccionado.tipoubigeo_id==this.nivelTipoUbigeo - 1;
      console.log(provinciaSeleccionado);
      // muestro habilitaciones urbanas
      this.idTipoUbigeo===4 && this.mostrarubigeos(provinciaSeleccionado.tipoubigeo_id, provinciaSeleccionado.codigo);
    } else{
      this.ubigeodistritos = [];
      this.listaHabilitacionUrbana = [];
      // this.mostrarprovincias(this.parametros.departamento);
    }
  }

  mostrarubigeos(idtipoubigeo, codigo) {
    this.cargando = true;
    let parametros = {idtipoubigeo: idtipoubigeo, codigo: codigo};
    this.ubigeoService.mostrarUbigeos(parametros, this);
  }

  despuesDeMostrarUbigeosProvincias(data) {
    this.cargando = false;
    this.ubigeoprovincias = data;
  }

  despuesDeMostrarUbigeosDistritos(data) {
    this.cargando = false;
    this.ubigeodistritos = data;
  }

  despuesDeMostrarUbigeosHabilitacionUrbanas(data){
    this.cargando = false;
    this.listaHabilitacionUrbana = data;
  }

  listarHabilitacionUrbana(activos: boolean) {
    this.cargando = true;
    let parametros = {
      activos
    }
    this.habilitacionurbanaService.listarHabilitacionUrbana(parametros, this);
  }

  despuesDeListarHabilitacionUrbana(data) {
    this.listaHabilitacionUrbana = data;
    this.cargando = false;
    console.log(data);
  }
  
  cancelar() {
    let parametros = {
      accion : LS.ACCION_CANCELAR,
      tipoubigeo: this.idTipoUbigeo
    }
    this.enviarAccion.emit(parametros);
  }
}
