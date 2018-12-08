import { Component, OnInit } from '@angular/core';
import { Empresa } from '../../../entidades/entidad.empresa';
import { ApiRequest2Service } from '../../../servicios/api-request2.service';
import { UbigeoGuardar } from '../../../entidades/entidad.ubigeoguardar';
import { Ubigeo } from '../../../entidades/entidad.ubigeo';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from '../../../servicios/login.service';
import { LoginComponent } from 'src/app/componentesgenerales/login/login.component';
// import { AuthService } from '../../../servicios/auth.service';

@Component({
  selector: 'app-welcome-component',
  templateUrl: './welcome-component.component.html',
  styleUrls: ['./welcome-component.component.css']
})
export class WelcomeComponentComponent implements OnInit {
  public empresa: Empresa;
  public imagen: string = null;
  public imagenAnterior: string = null; // solo se usara para editar usuario
  public ubigeo: UbigeoGuardar;
  public fecha = new Date();
  public iniciadosesion = false;
  errors: Array<Object> = [];

  constructor(
    public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public api: ApiRequest2Service,
    // public auth: AuthService,
    public toastr: ToastrService,
    public loginservicio: LoginService,
  ) {
    this.empresa = new Empresa();
    this.empresa.ubigeo_id = new Ubigeo();

    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();

    // this.iniciadosesion = this.loginservicio.isAuthenticated();
  }

  ngOnInit() {
    // this.auth.handleAuthentication(); // auth
    this.listarempresa();
  }

  listarempresa() {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.api.get2('empresa').then( // va a retornar siempre el primer registro de la tabla empresa en la bd
      (res) => {
        if (res !== 'vacio') {
          console.log('datos empresa: ');
          console.log(res);
          this.empresa = res;
          this.ubigeo = res.ubigeo;
          this.imagen = res.foto;
          console.log('res.foto = ' + this.imagen);
          console.log('nombre empresa = ' + this.empresa.nombre);
          this.imagenAnterior = res.foto;
        }
      },
      (error) => {
        if (error.status === 422) {
          this.errors = [];
          const errors = error.json();
          console.log('Error');
          /*for (const key in errors) {
            this.errors.push(errors[key]);
          }*/
        }
      }
    ).catch(err => this.handleError(err));
  }

  login() {
    // this.auth.login();
    const modalRef = this.modalService.open(LoginComponent, {size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      // this.iniciadosesion = this.loginservicio.isAuthenticated();
    }, (reason) => {
    });
  }

  salir() {
    // this.loginservicio.logout();
  }

  private handleError(error: any): void {
    this.toastr.error('Error Interno: ' + error, 'Error');
  }
}
