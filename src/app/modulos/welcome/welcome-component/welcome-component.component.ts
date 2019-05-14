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
  // public ubigeo: UbigeoGuardar;
  public fecha = new Date();
  public iniciadosesion = false;
  public constantes: any = LS;
  public tipopropiedades: string[] = [];
  public tipocontratodetalle = [];
  public ubigeos = [];
  public ubigeo: any;
  public filteridUbigeos;
  public contratodetalle: string = null;
  public propiedad: string = null;

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
    this.tipopropiedades = LS.LISTA_PROPIEDADES;
    this.tipocontratodetalle = LS.LISTA_CONTRATO_DETALLE;
    this.ubigeos = LS.LISTA_UBIGEO;
    // this.auth.handleAuthentication(); // auth
    this.empresa = new Empresa();
    // this.ubigeo = new UbigeoGuardar();
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
    // this.ubigeo = data.ubigeo;
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

  filterUbigeoSingle(event) {
    let query = event.query;
    this.filteridUbigeos = this.ubigeos.filter(item => 
      item.ubigeo.toLowerCase().indexOf(query.toLowerCase()) == 0);
  }

  filterCountry(query, ubigeos: any[]):any[] {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered : any[] = [];
    for(let i = 0; i < ubigeos.length; i++) {
        let ubigeo = ubigeos[i];
        if(ubigeo.ubigeo.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(ubigeo);
        }
    }
    return filtered;
  }
}
