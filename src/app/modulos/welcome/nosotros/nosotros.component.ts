import { Component, OnInit } from '@angular/core';
import { ApiRequest2Service } from '../../../servicios/api-request2.service';
import { Empresa } from '../../../entidades/entidad.empresa';
import { UbigeoGuardar } from '../../../entidades/entidad.ubigeoguardar';
import { Ubigeo } from '../../../entidades/entidad.ubigeo';
import { LS } from 'src/app/contantes/app-constants';
import {Router} from '@angular/router';
import { EmpresaService } from '../../empresa/configuracion/empresa/modal-empresa/empresa.service';
import { ZoomControlOptions, ControlPosition, ZoomControlStyle, FullscreenControlOptions, ScaleControlOptions, ScaleControlStyle, PanControlOptions } from '@agm/core/services/google-maps-types';

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
  public constantes: any = LS;
  public fecha = new Date();
  // Mapa
  public latitude: number = -5.196395;
  public longitude: number = -80.630287;
  public zoom: number = 16;

  constructor(
    public api: ApiRequest2Service,
    private empresaService: EmpresaService,
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
    this.traerParaEdicion();
  }

  verPropiedades(contrato: string) {
    LS.KEY_CONTRATO_SELECT = contrato;
    this.router.navigate(['/welcome/propiedades'])
  }

  traerParaEdicion() {
    if (LS.KEY_EMPRESA_SELECT) {
      this.empresa = LS.KEY_EMPRESA_SELECT;
      this.cargarMapa();
    } else {
      this.empresaService.listarEmpresa(this);
    }
  }

  despuesDeListarEmpresa(data) {
    this.empresa = data;
    this.ubigeo = data.ubigeo;
    this.imagen = data.foto;
    this.imagenAnterior = data.foto;
    LS.KEY_EMPRESA_SELECT = this.empresa;
    this.cargarMapa();
  }

  cargarMapa() {
    // Mapa
    this.empresa.latitud = this.empresa.latitud ? this.empresa.latitud : this.latitude+""
    this.empresa.longitud = this.empresa.longitud ? this.empresa.longitud : this.longitude+""
    this.latitude = Number.parseFloat(this.empresa.latitud);
    this.longitude = Number.parseFloat(this.empresa.longitud);
    // End Mapa
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
