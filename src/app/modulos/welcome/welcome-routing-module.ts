import { SuscripcionComponent } from './suscripcion/suscripcion.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponentComponent } from './welcome-component/welcome-component.component';
import { InicioComponent } from './inicio/inicio.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { PropiedadesComponent } from './propiedades/propiedades.component';
import { LoteDetalleComponent } from './componentes/lote-detalle/lote-detalle.component';

const welcomeRoutes: Routes = [
  {
    path: '',
    component: WelcomeComponentComponent,
    children: [
      {path: '', component: InicioComponent},
      {path: 'inicio', component: InicioComponent},
      {path: 'nosotros', component: NosotrosComponent},
      {path: 'propiedades', component: PropiedadesComponent},
      // {path: 'servicios/propiedades', component: PropiedadesComponent},
      // {path: 'lote/:id', component: LoteDetalleComponent},
      {path: 'contactos', component: SuscripcionComponent},
      {path: '', redirectTo: 'inicio', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(welcomeRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class WelcomeRoutingModule {
}
