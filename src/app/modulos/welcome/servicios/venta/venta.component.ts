import { Component, OnInit } from '@angular/core';
import { UbigeoGuardar } from '../../../../entidades/entidad.ubigeoguardar';
import { Ubigeo } from '../../../../entidades/entidad.ubigeo';
import { Rangoprecios } from '../../../../entidades/entidadad.rangoprecios';
import { ApiRequest2Service } from '../../../../servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  public tipopropiedades: string[] = [];
  public parametros: any = {};
  public rangoprecios: Rangoprecios[];
  public ubigeo: UbigeoGuardar;
  public cargando: Boolean = false;
  public ubigeodepartamentos: Ubigeo[];
  public ubigeoprovincias: Ubigeo[];
  public ubigeodistritos: Ubigeo[]; // son ubigeos de distritos que muestra en la tabla
  public lotes: any = []; // lista proyecto

  // tslint:disable-next-line:no-inferrable-types
  public idUbigeoDepartamento: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  public idUbigeoProvincia: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  public idUbigeoDistrito: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  public idRangoPrecio: number = 0;
  public activar: Boolean = false;

  constructor(
    public api: ApiRequest2Service,
    public toastr: ToastrService,
    private _router: Router,
  ) {
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.distrito = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.ubigeo.rangoprecio = new Rangoprecios();
    this.rangoprecios = [];

    this.ubigeodepartamentos = [];
    this.ubigeoprovincias = [];
    this.ubigeodistritos = [];
  }

  ngOnInit() {
    // this.tipopropiedades.push('Casas');
    // this.tipopropiedades.push('Cocheras');
    // this.tipopropiedades.push('Departamentos');
    // this.tipopropiedades.push('Habitaciones');
    // this.tipopropiedades.push('Locales');
    this.tipopropiedades.push('Lotes');
    this.listarUbigeos(); // index ubigeos (departamento)
    this.listarRangoPrecios();
  }

  cambiarActivar(activar) {
    this.activar = !activar;
  }

  listarUbigeos() {
    // this.cargando = true;
    this.api.get2('ubigeos').then(
      (res) => {
        this.ubigeodepartamentos = res;
        // this.cargando = false;
        console.log(res);
      },
      (error) => {
        if (error.status === 422) {
          // this.errors = [];
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

  listarRangoPrecios() {
    // this.cargando = true;
    const rango1 = new Rangoprecios();
    const rango2 = new Rangoprecios();
    const rango3 = new Rangoprecios();
    const rango4 = new Rangoprecios();
    const rango5 = new Rangoprecios();
    rango1.id = 1;
    rango1.preciominimo = "0";
    rango1.preciomaximo = "20000.00";
    rango2.id = 3;
    rango2.preciominimo = "20000.00";
    rango2.preciomaximo = "50000.00";
    rango3.id = 3;
    rango3.preciominimo = "50000.00";
    rango3.preciomaximo = "100000.00";
    rango4.id = 4;
    rango4.preciominimo = "100000.00";
    rango4.preciomaximo = "300000.00";
    rango5.id = 5;
    rango5.preciominimo = "300000.00";
    rango5.preciomaximo = undefined;
    this.rangoprecios[0] = rango1;
    this.rangoprecios[1] = rango2;
    this.rangoprecios[2] = rango3;
    this.rangoprecios[3] = rango4;
    this.rangoprecios[4] = rango5;
  }

  mostrarprovincias(idubigeo) {
    if (idubigeo > 0) {
      let departamento: Ubigeo = new Ubigeo();
      for (const ubigeo of this.ubigeodepartamentos) {
        if (idubigeo === ubigeo.id) {
          departamento = ubigeo;
        }
      }
      this.ubigeo.departamento = departamento;
      console.log(departamento);
      this.mostrarubigeos(departamento.tipoubigeo_id, departamento.codigo); // provincias
      // this.mostrarlotes(departamento.tipoubigeo_id, departamento.codigo);
      this.mostrarlotes();
    } else {
      this.lotes = [];
      this.ubigeoprovincias = [];
      this.ubigeodistritos = [];
      this.ubigeo.provincia = new Ubigeo();
      this.ubigeo.distrito = new Ubigeo();
      // this.parametros.departamento = null;
      // this.listarUbigeos();
    }
  }

  mostrardistritos(idubigeo) {
    if (idubigeo > 0) {
      let provincia: Ubigeo = new Ubigeo();
      for (const ubigeo of this.ubigeoprovincias) {
        if (idubigeo === ubigeo.id) {
          provincia = ubigeo;
        }
      }
      this.ubigeo.provincia = provincia;
      console.log(provincia);
      this.mostrarubigeos(provincia.tipoubigeo_id, provincia.codigo); // provincias
      this.mostrarlotes();
    } else {
      this.ubigeodistritos = [];
      this.ubigeo.distrito = new Ubigeo();
      this.ubigeo.provincia = new Ubigeo();
      // buscar por departamento (regresando al combo departamento)
      this.mostrarlotes();
      // this.parametros.departamento = null;
      // this.listarUbigeos();
    }
  }

  mostrarpadistritos(idubigeo) {
    if (idubigeo > 0) {
      let distrito: Ubigeo = new Ubigeo();
      for (const ubigeo of this.ubigeodistritos) {
        if (idubigeo === ubigeo.id) {
          distrito = ubigeo;
        }
      }
      this.ubigeo.distrito = distrito;
      console.log(distrito);
      this.mostrarlotes();
    } else {
      // this.ubigeodistritos = [];
      this.ubigeo.distrito = new Ubigeo();
      this.mostrarlotes();
      // this.parametros.departamento = null;
      // this.listarUbigeos();
    }
  }

  mostrarparangoprecios(idrangoprecio) {
    if (idrangoprecio > 0) {
      let rangoprecio = new Rangoprecios();
      for (const rango of this.rangoprecios) {
        if (idrangoprecio === rango.id) {
          rangoprecio = rango;
        }
      }
      this.ubigeo.rangoprecio = rangoprecio;
      console.log('rango de precio:');
      console.log(rangoprecio);
      this.mostrarlotes();
    } else {
      this.ubigeo.rangoprecio = new Rangoprecios();
      this.mostrarlotes();
    }
  }

  // en ventas solo hay lotes
  mostrarlotes() {
    this.cargando = true;
    console.log('Ubigeo:');
    console.log(this.ubigeo);
    this.api.post2('mostrarlotes', this.ubigeo).then(
      (res) => {
        this.lotes = res;
        console.log('Ubigeo:');
        console.log(this.ubigeo);
        console.log('Los lotes son:');
        console.log(res);
        this.cargando = false;
      },
      (error) => {
        if (error.status === 422) {
          // .errors = [];
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

  redondear(numero) {
    return Math.round(numero);
  }

  verDetalleLote(idlote: number) {
    this._router.navigate(['/welcome/lote/detalle', idlote]);
  }

  limpiar() {
    this.lotes = [];
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.distrito = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.ubigeo.rangoprecio = new Rangoprecios();

    // this.ubigeodepartamentos = [];
    // this.idUbigeoDepartamento = 0;
    this.ubigeoprovincias = [];
    this.ubigeodistritos = [];
  }

  mostrarubigeos(idtipoubigeo, codigo) {
    // this.cargando = true;
    this.api.get2('mostrarubigeos/' + idtipoubigeo + '/' + codigo).then(
      (res) => {
        if (idtipoubigeo === 1) { // departamento
          // listo las provincias del departamento
          this.ubigeoprovincias = res;
          // this.ubigeos = this.ubigeoprovincias;
        } else if (idtipoubigeo === 2) { // provincia
          // listo los distritos de la provincia
          this.ubigeodistritos = res; // distritos
        }
        // this.ubigeos = res;
        // this.cargando = false;
        console.log(res);
      },
      (error) => {
        if (error.status === 422) {
          // this.errors = [];
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

  private handleError(error: any): void {
    // this.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }
}
