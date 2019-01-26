import { Component, OnInit } from '@angular/core';
import { Empresa } from '../../../entidades/entidad.empresa';
import { ApiRequest2Service } from '../../../servicios/api-request2.service';
import { UbigeoGuardar } from '../../../entidades/entidad.ubigeoguardar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from '../../../servicios/login.service';
import { LoginComponent } from 'src/app/componentesgenerales/login/login.component';
import { EmpresaService } from '../../empresa/configuracion/empresa/modal-empresa/empresa.service';
import { LS } from 'src/app/contantes/app-constants';
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
  public constantes: any = LS;

  constructor(
    private modalService: NgbModal,
    public api: ApiRequest2Service,
    private empresaService: EmpresaService,
    // public auth: AuthService,
    private loginservicio: LoginService,
  ) {
    // this.iniciadosesion = this.loginservicio.isAuthenticated();
  }

  ngOnInit() {
    // this.auth.handleAuthentication(); // auth
    this.empresa = new Empresa();
    this.ubigeo = new UbigeoGuardar();
    if (LS.KEY_EMPRESA_SELECT) {
      this.empresa = LS.KEY_EMPRESA_SELECT;
    } else {
      this.traerParaEdicion();
    }
  }

  traerParaEdicion() {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.empresaService.listarEmpresa(this);
  }

  despuesDeListarEmpresa(data) {
    this.empresa = data;
    this.ubigeo = data.ubigeo;
    this.imagen = data.foto;
    this.imagenAnterior = data.foto;
    LS.KEY_EMPRESA_SELECT = this.empresa;
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
}
