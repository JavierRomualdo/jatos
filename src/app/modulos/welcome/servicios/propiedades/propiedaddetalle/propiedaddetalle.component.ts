import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiRequest2Service } from '../../../../../servicios/api-request2.service';
import { Casa } from '../../../../../entidades/entidad.casa';
import { FileItem } from '../../../../../entidades/file-item';
import { Servicios } from '../../../../../entidades/entidad.servicios';
import { Casaservicio } from '../../../../../entidades/entidad.casaservicio';
import { Foto } from '../../../../../entidades/entidad.foto';
import { Persona } from '../../../../../entidades/entidad.persona';
import { UbigeoGuardar } from '../../../../../entidades/entidad.ubigeoguardar';
import { Ubigeo } from '../../../../../entidades/entidad.ubigeo';
import { ToastrService } from 'ngx-toastr';
import { CasaMensaje } from '../../../../../entidades/entidad.casamensaje';

@Component({
  selector: 'app-propiedaddetalle',
  templateUrl: './propiedaddetalle.component.html',
  styleUrls: ['./propiedaddetalle.component.css']
})
export class PropiedadDetalleComponent implements OnInit {
  @Input() id;
  public casa: Casa;
  public mensaje: CasaMensaje;
  public cargando: Boolean = false;
  public archivos: FileItem[] = [];
  public servicios: Servicios[];
  public casaservicios: Casaservicio[];
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
    this.casa = new Casa();
    this.mensaje = new CasaMensaje();
    this.fotos = [];
    this.servicios = [];
    this.persona = new Persona();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.distrito = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.archivos = [];
    this.listaLP = [];
  }

  ngOnInit() {
    if (this.id) {
      this.listarPropiedad(this.id);
    }
    // this._activedRoute.params.subscribe(params => {
    //   this.listarPropiedad(params['id']);
    // });
  }

  listarPropiedad(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.cargando = true;
    this.api.get2('casas/' + id).then(
      (res) => {
        // console.log(res);
        this.casa = res;
        this.listaLP = res.casapersonaList;
        this.persona = this.listaLP[0];
        this.ubigeo = res.ubigeo;
        this.servicios = res.serviciosList;
        this.casaservicios = res.casaservicioList;

        for (const item of res.fotosList) {
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
      },
      (error) => {
        if (error.status === 422) {
          this.errors = [];
          const errors = error.json();
          console.log('Error');
          // this.cargando = false;
          /*for (const key in errors) {
            this.errors.push(errors[key]);
          }*/
        }
      }
    ).catch(err => this.handleError(err));
  }

  enviarmensaje() {
    this.cargando = true;
    this.mensaje.casa_id = this.casa.id;
    this.api.post2('casamensaje', this.mensaje).then(
      (res) => {
        console.log('se ha enviado mensaje: ');
        console.log(res);
        this.toastr.success('Mensaje enviado');
        this.mensaje = new CasaMensaje();
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
    // this.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }
}
