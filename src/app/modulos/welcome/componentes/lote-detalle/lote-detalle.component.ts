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

  constructor(
    private _activedRoute: ActivatedRoute,
    public api: ApiRequest2Service,
    public toastr: ToastrService,
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
      this.listarLotes(this.id);
    }
    // this._activedRoute.params.subscribe(params => {
    //   this.listarLotes(params['id']);
    // });
  }

  listarLotes(id) {
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
      mensaje: this.mensaje.mensaje
    }
    // this.cargando = true;
    this.api.post2('enviarMensajeCliente', parametros).then(
      (data) => {
        console.log('se ha enviado correo: ');
        console.log(data);
        this.toastr.success('Correo enviado');
        this.mensaje = new LoteMensaje();
        this.cargando = false;
        
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

  private handleError(error: any): void {
    this.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }
}
