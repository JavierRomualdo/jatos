import { Component, OnInit } from '@angular/core';
import { LS } from 'src/app/contantes/app-constants';
import { Router } from '@angular/router';

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
  
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.fechaActual = new Date();
    this.foto = JSON.parse(localStorage.getItem(LS.KEY_FOTO_PERFIL));
    this.notificacionDto = JSON.parse(localStorage.getItem(LS.KEY_NOTIFICACIONES));
    this.notificaciones = this.notificacionDto.notificaciones;
    this.cantidad = this.notificacionDto.cantidad;
    console.log(this.notificaciones);
  }

  verPerfilUsuario() {
    LS.KEY_IS_PERFIL_USER = true;
    this.router.navigate(['/empresa/configuracion/usuarios'])
  }
}
