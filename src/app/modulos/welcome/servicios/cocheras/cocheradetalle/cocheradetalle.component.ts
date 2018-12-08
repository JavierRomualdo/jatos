import { Component, OnInit, Input } from "@angular/core";
import { Cochera } from "../../../../../entidades/entidad.cochera";
import { CocheraMensaje } from "../../../../../entidades/entidad.cocheramensaje";
import { FileItem } from "../../../../../entidades/file-item";
import { Cocheraservicio } from "../../../../../entidades/entidad.cocheraservicio";
import { Foto } from "../../../../../entidades/entidad.foto";
import { Servicios } from "../../../../../entidades/entidad.servicios";
import { Persona } from "../../../../../entidades/entidad.persona";
import { UbigeoGuardar } from "../../../../../entidades/entidad.ubigeoguardar";
import { ActivatedRoute } from "@angular/router";
import { ApiRequest2Service } from "../../../../../servicios/api-request2.service";
import { ToastrService } from "ngx-toastr";
import { Ubigeo } from "../../../../../entidades/entidad.ubigeo";

@Component({
  selector: "app-cocheradetalle",
  templateUrl: "./cocheradetalle.component.html",
  styleUrls: ["./cocheradetalle.component.css"]
})
export class CocheradetalleComponent implements OnInit {
  @Input()
  id;
  public cochera: Cochera;
  public mensaje: CocheraMensaje;
  public cargando: Boolean = false;
  public archivos: FileItem[] = [];
  public servicios: Servicios[];
  public casaservicios: Cocheraservicio[];
  public fotos: Foto[];
  public persona: Persona;
  public ubigeo: UbigeoGuardar;
  public listaLP: any = []; // lista de persona-roles
  errors: Array<Object> = [];

  constructor(
    private _activedRoute: ActivatedRoute,
    public api: ApiRequest2Service,
    public toastr: ToastrService
  ) {
    this.cochera = new Cochera();
    this.mensaje = new CocheraMensaje();
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
    this.api
      .get2("cocheras/" + id)
      .then(
        res => {
          // console.log(res);
          this.cochera = res;
          this.listaLP = res.casapersonaList;
          // this.persona = this.listaLP[0];
          this.ubigeo = res.ubigeo;
          this.servicios = res.serviciosList;
          this.casaservicios = res.casaservicioList;

          for (const item of res.fotosList) {
            console.log("foto: ");
            console.log(item);
            this.fotos.push(item);
          }
          console.log("fotoss : ");
          console.log(this.fotos);
          // this.fotos = res.fotosList;
          console.log("traido para edicion");
          console.log(this.cochera);
          this.cochera.fotosList = {}; // tiene que ser vacio xq son la lista de imagenes nuevas pa agregarse
          // traer archivos de firebase storage
          // this._cargaImagenes.getImagenes(res.path);

          // aqui metodo para mostrar todas las imagenes de este propiedad ....
          // this.imagen = res.foto;
          // this.imagenAnterior = res.foto;
          this.cargando = false;
        },
        error => {
          if (error.status === 422) {
            this.errors = [];
            const errors = error.json();
            console.log("Error");
            // this.cargando = false;
            /*for (const key in errors) {
            this.errors.push(errors[key]);
          }*/
          }
        }
      )
      .catch(err => this.handleError(err));
  }

  enviarmensaje() {
    this.cargando = true;
    this.mensaje.cochera_id = this.cochera.id;
    this.api
      .post2("cocheramensaje", this.mensaje)
      .then(
        res => {
          console.log("se ha enviado mensaje: ");
          console.log(res);
          this.toastr.success("Mensaje enviado");
          this.mensaje = new CocheraMensaje();
          this.cargando = false;
        },
        error => {
          if (error.status === 422) {
            this.errors = [];
            const errors = error.json();
            console.log("Error");
            this.cargando = false;
            this.handleError(error);
            /*for (const key in errors) {
            this.errors.push(errors[key]);
          }*/
          }
        }
      )
      .catch(err => this.handleError(err));
  }

  private handleError(error: any): void {
    // this.cargando = false;
    this.toastr.error("Error Interno: " + error, "Error");
  }
}
