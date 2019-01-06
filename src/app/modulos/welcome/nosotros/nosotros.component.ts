import { Component, OnInit } from '@angular/core';
import { ApiRequest2Service } from '../../../servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { Empresa } from '../../../entidades/entidad.empresa';
import { UbigeoGuardar } from '../../../entidades/entidad.ubigeoguardar';
import { Ubigeo } from '../../../entidades/entidad.ubigeo';
import { LS } from 'src/app/contantes/app-constants';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css']
})
export class NosotrosComponent implements OnInit {
  public empresa: Empresa;
  public imagen: string = null;
  public imagenAnterior: string = null; // solo se usara para editar usuario
  public ubigeo: UbigeoGuardar;
  public fecha = new Date();
  errors: Array<Object> = [];
  lat: Number = -5.196395;
  lng: Number = -80.630287;
  zoom: Number = 16;

  public constantes: any = LS;

  constructor(
    public api: ApiRequest2Service,
    public toastr: ToastrService,
    private router: Router,
  ) {
    this.empresa = new Empresa();
    this.empresa.ubigeo_id = new Ubigeo();

    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
  }

  ngOnInit() {
    this.listarempresa();
  }

  verPropiedades(contrato: string) {
    LS.KEY_CONTRATO_SELECT = contrato;
    this.router.navigate(['/welcome/propiedades'])
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
          console.log('empresa');
          console.log(this.empresa);
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

  private handleError(error: any): void {
    this.toastr.error('Error Interno: ' + error, 'Error');
  }

}
