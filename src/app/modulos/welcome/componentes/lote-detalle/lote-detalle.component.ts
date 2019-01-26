import { Component, OnInit, Input } from '@angular/core';
import { Lote } from 'src/app/entidades/entidad.lote';
import { LoteMensaje } from 'src/app/entidades/entidad.lotemensaje';
import { FileItem } from 'src/app/entidades/file-item';
import { Servicios } from 'src/app/entidades/entidad.servicios';
import { Foto } from 'src/app/entidades/entidad.foto';
import { Persona } from 'src/app/entidades/entidad.persona';
import { UbigeoGuardar } from 'src/app/entidades/entidad.ubigeoguardar';
import { ActivatedRoute } from '@angular/router';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { Ubigeo } from 'src/app/entidades/entidad.ubigeo';
import { LS } from 'src/app/contantes/app-constants';
import { MailService } from 'src/app/servicios/mail/mail.service';
import { ZoomControlOptions, ControlPosition, ZoomControlStyle, FullscreenControlOptions, ScaleControlOptions, ScaleControlStyle, PanControlOptions } from '@agm/core/services/google-maps-types';

@Component({
  selector: 'app-lote-detalle',
  templateUrl: './lote-detalle.component.html',
  styleUrls: ['./lote-detalle.component.css']
})
export class LoteDetalleComponent implements OnInit {

  @Input() id;
  public lote: Lote;
  public mensaje: LoteMensaje;
  public cargando: Boolean = false;
  public archivos: FileItem[] = [];
  public servicios: Servicios[];
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
    this.lote = new Lote();
    this.mensaje = new LoteMensaje();
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
      this.obtenerLote(this.id);
    }
    // this._activedRoute.params.subscribe(params => {
    //   this.obtenerLote(params['id']);
    // });
  }

  obtenerLote(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.cargando = true;
    this.api.get2('lotes/' + id).then(
      (data) => {
        if (data && data.extraInfo) {
          // console.log(res);
          this.lote = data.extraInfo;
          this.listaLP = data.extraInfo.lotepersonaList;
          this.persona = this.listaLP[0];
          this.ubigeo = data.extraInfo.ubigeo;
          this.servicios = data.extraInfo.serviciosList;

          for (const item of data.extraInfo.fotosList) {
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
          // Mapa
          this.lote.latitud = this.lote.latitud ? this.lote.latitud : this.latitude+""
          this.lote.longitud = this.lote.longitud ? this.lote.longitud : this.longitude+""
          this.latitude = Number.parseFloat(this.lote.latitud);
          this.longitude = Number.parseFloat(this.lote.longitud);
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
    this.mensaje.lote_id = this.lote.id;
    this.api.post2('lotemensaje', this.mensaje).then(
      (res) => {
        console.log('se ha enviado mensaje: ');
        console.log(res);
        this.toastr.success('Mensaje enviado');
        this.enviarCorreo();
        // this.mensaje = new LoteMensaje();
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
      propiedad: 'LOte',
      propiedad_id: this.lote.codigo,
      contrato: this.lote.contrato==='A' ? 'Alquiler' : 'Venta', 
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
      this.mensaje = new LoteMensaje();
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
