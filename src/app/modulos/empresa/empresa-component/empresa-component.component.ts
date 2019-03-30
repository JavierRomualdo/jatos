import { Component, OnInit } from '@angular/core';
import { LS } from 'src/app/contantes/app-constants';
import { Router } from '@angular/router';
import { ApiRequest2Service } from 'src/app/servicios/api-request2.service';
import { UtilService } from 'src/app/servicios/util/util.service';
import { DataUpdateService } from 'src/app/servicios/dataUpdate/data-update.service';

@Component({
  selector: 'app-empresa-component',
  templateUrl: './empresa-component.component.html',
  styleUrls: ['./empresa-component.component.css']
})
export class EmpresaComponentComponent implements OnInit {

  public fechaActual: Date;
  public constantes: any = LS;
  public foto: string = null;
  public notificacionDto: any;
  public cantidad: number = 0;
  public notificaciones = [];
  public online$: any;
  public conexion: boolean = true;
  
  constructor(
    private router: Router,
    private utilService: UtilService,
    private api: ApiRequest2Service,
    private dataUpdateService: DataUpdateService
  ) {
    this.online$ = this.api.verificarConexionInternet();
    this.networkStatus()
  }

  ngOnInit() {
    this.fechaActual = new Date();
    // this.foto = JSON.parse(localStorage.getItem(LS.KEY_FOTO_PERFIL));
    // if (JSON.parse(localStorage.getItem(LS.KEY_FOTO_PERFIL))) {
    //   this.dataUpdateService.setFotoPerfil(JSON.parse(localStorage.getItem(LS.KEY_FOTO_PERFIL)));
    // }
    this.dataUpdateService.getFotoPerfil().subscribe(data => {
      console.log("empresa-component", data);
      this.foto = data;
    });
    this.notificacionDto = JSON.parse(localStorage.getItem(LS.KEY_NOTIFICACIONES));
    this.notificaciones = this.notificacionDto.notificaciones;
    this.cantidad = this.notificacionDto.cantidad;
    console.log(this.notificaciones);
  }

  verPerfilUsuario() {
    LS.KEY_IS_PERFIL_USER = true;
    this.router.navigate(['/empresa/configuracion/usuarios'])
  }

  public networkStatus() {
    this.online$.subscribe(value => {
      this.conexion = value;
      if (!this.conexion) {
        let parametros = {
          title: LS.ACCION_INTERNET,
          texto: LS.MSJ_INTERNET_NO_ESTABLECIDA,
          type: LS.SWAL_WARNING,
          confirmButtonText: LS.LABEL_ACEPTAR,
          cancelButtonText: LS.LABEL_CANCELAR
        };
        this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
          if (respuesta) {//Si presiona CONTABILIZAR
          } else {//Cierra el formulario
          }
        });
      }
    })
  }
}
