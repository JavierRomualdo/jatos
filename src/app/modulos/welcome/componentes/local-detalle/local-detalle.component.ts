import { Component, OnInit, Input } from '@angular/core';
import { Local } from 'src/app/entidades/entidad.local';
import { LocalMensaje } from 'src/app/entidades/entidad.localmensaje';
import { FileItem } from 'src/app/entidades/file-item';
import { Servicios } from 'src/app/entidades/entidad.servicios';
import { Localservicio } from 'src/app/entidades/entidad.localservicio';
import { Foto } from 'src/app/entidades/entidad.foto';
import { Persona } from 'src/app/entidades/entidad.persona';
import { UbigeoGuardar } from 'src/app/entidades/entidad.ubigeoguardar';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { LS } from 'src/app/contantes/app-constants';
import { MailService } from 'src/app/servicios/mail/mail.service';
import { ZoomControlOptions, ControlPosition, ZoomControlStyle, FullscreenControlOptions, ScaleControlOptions, ScaleControlStyle, PanControlOptions } from '@agm/core/services/google-maps-types';

@Component({
  selector: 'app-local-detalle',
  templateUrl: './local-detalle.component.html',
  styleUrls: ['./local-detalle.component.css']
})
export class LocalDetalleComponent implements OnInit {

  @Input() id;
  public local: Local;
  public mensaje: LocalMensaje;
  public cargando: Boolean = false;
  public archivos: FileItem[] = [];
  public servicios: Servicios[];
  public localservicios: Localservicio[];
  public fotos: Foto[];
  public persona: Persona;
  public ubigeo: UbigeoGuardar;
  public listaLP: any = []; // lista de persona-roles
  errors: Array<Object> = [];
  public constantes: any = LS;
  // Mapa
  public latitude: number = -5.196395;
  public longitude: number = -80.630287;
  public zoom: number = 16;
  
  constructor(
    private _activedRoute: ActivatedRoute,
    public api: ApiRequest2Service,
    public toastr: ToastrService,
    private mensajeService: MailService
  ) {
    this.local = new Local();
    this.mensaje = new LocalMensaje();
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
    if (this.id) {
      this.obtenerLocal(this.id);
    }
    // this._activedRoute.params.subscribe(params => {
    //   this.obtenerLocal(params['id']);
    // });
  }

  obtenerLocal(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.cargando = true;
    this.api.get2('locales/' + id).then(
      (data) => {
        // console.log(res);
        if (data && data.extraInfo) {
          this.local = data.extraInfo;
          this.listaLP = data.extraInfo.localpersonaList;
          this.persona = this.listaLP[0];
          this.ubigeo = data.extraInfo.ubigeo;
          this.servicios = data.extraInfo.serviciosList;
          this.localservicios = data.extraInfo.localservicioList;

          for (const item of data.extraInfo.fotosList) {
            console.log('foto: ');
            console.log(item);
            this.fotos.push(item);
          }
          console.log('fotoss : ');
          console.log(this.fotos);
          // this.fotos = res.fotosList;
          console.log('traido para edicion');
          console.log(this.local);
          this.local.fotosList = {}; // tiene que ser vacio xq son la lista de imagenes nuevas pa agregarse
          // traer archivos de firebase storage
          // this._cargaImagenes.getImagenes(res.path);

          // aqui metodo para mostrar todas las imagenes de este local ....
          // this.imagen = res.foto;
          // this.imagenAnterior = res.foto;
          // Mapa
          this.local.latitud = this.local.latitud ? this.local.latitud : this.latitude+""
          this.local.longitud = this.local.longitud ? this.local.longitud : this.longitude+""
          this.latitude = Number.parseFloat(this.local.latitud);
          this.longitude = Number.parseFloat(this.local.longitud);
          // End Mapa
          this.cargando = false;
        }
      },
      (error) => {
        if (error.status === 422) {
          this.errors = [];
          const errors = error.json();
          console.log('Error');
          this.cargando = false;
          /*for (const key in errors) {
            this.errors.push(errors[key]);
          }*/
        }
      }
    ).catch(err => this.handleError(err));
  }

  enviarmensaje() {
    this.cargando = true;
    this.mensaje.local_id = this.local.id;
    this.api.post2('localmensaje', this.mensaje).then(
      (res) => {
        console.log('se ha enviado mensaje: ');
        console.log(res);
        this.toastr.success('Mensaje enviado');
        this.enviarCorreo();
        // this.mensaje = new LocalMensaje();
        // this.cargando = false;
      },
      (error) => {
        if (error.status === 422) {
          this.errors = [];
          const errors = error.json();
          console.log('Error');
          this.cargando = false;
          this.handleError(error);
          /*for (const key in errors) {
            this.errors.push(errors[key]);
          }*/
        }
      }
    ).catch(err => this.handleError(err));
  }

  enviarCorreo() {
    let parametros = {
      propiedad: 'Local',
      propiedad_id: this.local.codigo,
      contrato: this.local.contrato==='A' ? 'Alquiler' : 'Venta', 
      cliente: this.mensaje.nombres,
      telefono: this.mensaje.telefono,
      email: this.mensaje.email,
      titulo: this.mensaje.titulo,
      mensaje: this.mensaje.mensaje,
      emailReceptor: LS.KEY_EMPRESA_SELECT ? LS.KEY_EMPRESA_SELECT.correo : 'javierromualdo2014@gmail.com'
    }
    // this.cargando = true;
    this.mensajeService.envioCorreoDelCliente(parametros, this);
  }

  despuesDeEnvioCorreoDelCliente(data) {
    if (data) {
      this.mensaje = new LocalMensaje();
    }
    this.cargando = false;
  }

  private handleError(error: any): void {
    this.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }

  // Mapa
  zoomControlOptions: ZoomControlOptions = {
    position: ControlPosition.RIGHT_BOTTOM,
    style: ZoomControlStyle.LARGE
  };

  fullscreenControlOptions: FullscreenControlOptions = {
    position : ControlPosition.TOP_RIGHT
  };

  // mapTypeControlOptions: MapTypeControlOptions = {
  //   mapTypeIds: [ MapTypeId.ROADMAP],
  //   position: ControlPosition.BOTTOM_LEFT,
  // };

  scaleControlOptions: ScaleControlOptions = {
    style: ScaleControlStyle.DEFAULT
  }

  panControlOptions: PanControlOptions = {
    position: ControlPosition.LEFT_TOP,
  }
  // End Mapa
}
