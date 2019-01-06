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

import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { PaWelcomeCargandoComponent } from 'src/app/componentesgenerales/cargando/cargando.component';
import { AgmCoreModule } from '@agm/core';

import { ToastrModule } from 'ngx-toastr';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import {PanelModule} from 'primeng/panel';
import {SpinnerModule} from 'primeng/spinner';
import {TooltipModule} from 'primeng/tooltip';
import { CasaDetalleComponent } from './componentes/casa-detalle/casa-detalle.component';
import { CocheraDetalleComponent } from './componentes/cochera-detalle/cochera-detalle.component';
import { LoteDetalleComponent } from './componentes/lote-detalle/lote-detalle.component';
import { LocalDetalleComponent } from './componentes/local-detalle/local-detalle.component';
import { HabitacionDetalleComponent } from './componentes/habitacion-detalle/habitacion-detalle.component';
import { Autonumeric2Directive2 } from 'src/app/directivas/autonumeric2/autonumeric2.directive';

@NgModule({
  declarations: [
    WelcomeComponentComponent, 
    InicioComponent, 
    
    PropiedadesComponent,
    NosotrosComponent,
    SuscripcionComponent,
    NavbarComponent,
    FooterComponent,
    PaWelcomeCargandoComponent,
    
    CasaDetalleComponent,
    CocheraDetalleComponent,
    HabitacionDetalleComponent,
    LocalDetalleComponent,
    LoteDetalleComponent,

    Autonumeric2Directive2
  ],
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
