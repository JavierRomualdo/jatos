import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponentComponent } from './welcome-component/welcome-component.component';
import { WelcomeRoutingModule } from './welcome-routing-module';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InicioComponent } from './inicio/inicio.component';
import { PropiedadesComponent } from './propiedades/propiedades.component';
import { SuscripcionComponent } from './suscripcion/suscripcion.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { PropiedadesServiceComponent } from './servicios/propiedades/propiedades.component';
import { PropiedadDetalleComponent } from './servicios/propiedades/propiedaddetalle/propiedaddetalle.component';

import { LoteDetalleComponent } from './servicios/lotes/lotedetalle/lotedetalle.component';
import { LocalDetalleComponent } from './servicios/alquileres/locales/localdetalle/localdetalle.component';
import { HabitacionDetalleComponent } from './servicios/alquileres/habitaciones/habitaciondetalle/habitaciondetalle.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { VentaComponent } from './servicios/venta/venta.component';
import { AlquilerComponent } from './servicios/alquiler/alquiler.component';
import { CocheradetalleComponent } from './servicios/cocheras/cocheradetalle/cocheradetalle.component';
import { PaWelcomeCargandoComponent } from 'src/app/componentesgenerales/cargando/cargando.component';
import { AgmCoreModule } from '@agm/core';

import { ToastrModule } from 'ngx-toastr';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import {PanelModule} from 'primeng/panel';
import {SpinnerModule} from 'primeng/spinner';
import {TooltipModule} from 'primeng/tooltip';
import { LotesComponent } from './servicios/lotes/lotes.component';
import { LocalesComponent } from './servicios/alquileres/locales/locales.component';
import { HabitacionesComponent } from './servicios/alquileres/habitaciones/habitaciones.component';
import { AlquileresComponent } from './servicios/alquileres/alquileres.component';

@NgModule({
  declarations: [
    WelcomeComponentComponent, 
    InicioComponent, 
    
    PropiedadesComponent,
    PropiedadesServiceComponent,
    PropiedadDetalleComponent,
    LotesComponent,
    LoteDetalleComponent,
    LocalesComponent,
    LocalDetalleComponent,
    HabitacionesComponent,
    HabitacionDetalleComponent,
    AlquileresComponent,
    NosotrosComponent,
    SuscripcionComponent,
    NavbarComponent,
    FooterComponent,
    PaWelcomeCargandoComponent,
    VentaComponent,
    AlquilerComponent,
    CocheradetalleComponent,
    
    ServiciosComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    WelcomeRoutingModule,

    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyACiya9u1WJZ3DBZmZcw2gUlczgoHtxC80'
    }),
    ToastrModule.forRoot(),
    WelcomeRoutingModule,
    RadioButtonModule,
    CheckboxModule,
    ScrollPanelModule,
    PanelModule,
    SpinnerModule,
    TooltipModule
  ],
  providers: [
    NgbActiveModal,
  ]})
export class WelcomeModule { }
