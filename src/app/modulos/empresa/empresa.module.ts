import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {KeyFilterModule} from 'primeng/keyfilter';
import {ProgressBarModule} from 'primeng/progressbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import {InputSwitchModule} from 'primeng/inputswitch';

import { HomeComponent } from './home/home.component';
import { ApartamentosComponent } from './propiedades/apartamentos/apartamentos.component';
import { ModalApartamentoComponent } from './propiedades/apartamentos/modal-apartamento/modal-apartamento.component';
import { ModalApartamentocuartoComponent } from './propiedades/apartamentos/modal-apartamentocuarto/modal-apartamentocuarto.component';
import { CasasComponent } from './propiedades/casas/casas.component';
import { CocherasComponent } from './propiedades/cocheras/cocheras.component';
import { ModalCocheraComponent } from './propiedades/cocheras/modal-cochera/modal-cochera.component';
import { HabitacionesComponent } from './propiedades/habitaciones/habitaciones.component';
import { ModalHabitacionComponent } from './propiedades/habitaciones/modal-habitacion/modal-habitacion.component';
import { LocalesComponent } from './propiedades/locales/locales.component';
import { ModalLocalComponent } from './propiedades/locales/modal-local/modal-local.component';
import { LotesComponent } from './propiedades/lotes/lotes.component';
import { ModalLoteComponent } from './propiedades/lotes/modal-lote/modal-lote.component';
import { ModalCasaComponent } from './propiedades/casas/modal-casa/modal-casa.component';
import { AlquileresComponent } from './alquileres/alquileres.component';
import { VentasComponent } from './ventas/ventas.component';
import { EmpresaComponentComponent } from './empresa-component/empresa-component.component';
import { EmpresaRoutingModule } from './empresa-routing-module';
import { NgDropFileDirective } from 'src/app/directivas/ng-drop-file.directive';
import { UbigeoComponent } from './configuracion/ubigeo/ubigeo.component';
import { EmpresaConfiguracionComponent } from './configuracion/empresa/empresa.component';
import { ComponentesModule } from '../componentes/componentes.module';
import { EstamosTrabajandoComponent } from 'src/app/componentesgenerales/estamos-trabajando/estamos-trabajando.component';
import { CargandoComponent } from 'src/app/componentesgenerales/cargando/cargando.component';
import { ModalEmpresaComponent } from './configuracion/empresa/modal-empresa/modal-empresa.component';
import { ModalPersonaComponent } from './configuracion/empresa/modal-persona/modal-persona.component';
import { ModalRolComponent } from './configuracion/empresa/modal-rol/modal-rol.component';
import { ModalServicioComponent } from './configuracion/empresa/modal-servicio/modal-servicio.component';
import { ModalTipoubigeoComponent } from './configuracion/ubigeo/modal-tipoubigeo/modal-tipoubigeo.component';
import { ModalUbigeoComponent } from './configuracion/ubigeo/modal-ubigeo/modal-ubigeo.component';
import { ConfirmacionComponent } from 'src/app/componentesgenerales/confirmacion/confirmacion.component';
import { ModalUsuarioComponent } from './configuracion/empresa/modal-usuario/modal-usuario.component';
import { CargaImagenesService } from 'src/app/servicios/carga-imagenes.service';
import { UtilService } from 'src/app/servicios/util/util.service';

@NgModule({
  declarations: [HomeComponent,
    ApartamentosComponent, 
    ModalApartamentoComponent, 
    ModalApartamentocuartoComponent, 
    CasasComponent, 
    ModalCasaComponent, 
    CocherasComponent, 
    ModalCocheraComponent, 
    HabitacionesComponent, 
    ModalHabitacionComponent, 
    LocalesComponent, 
    ModalLocalComponent, 
    LotesComponent, 
    ModalLoteComponent, 
    AlquileresComponent, 
    VentasComponent, 
    EmpresaComponentComponent,
    UbigeoComponent,
    EmpresaConfiguracionComponent,
    EstamosTrabajandoComponent,
    CargandoComponent,
    NgDropFileDirective,
    ModalEmpresaComponent,
    ModalPersonaComponent,
    ModalRolComponent,
    ModalServicioComponent,
    ModalTipoubigeoComponent,
    ModalUbigeoComponent,
    ConfirmacionComponent,
    ModalUsuarioComponent
  ],
  imports: [
    ComponentesModule,
    CommonModule,
    EmpresaRoutingModule,
    NgbModule.forRoot(),
    KeyFilterModule,
    ProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    RadioButtonModule,
    CheckboxModule,
    InputSwitchModule
  ],
  entryComponents: [
    ModalEmpresaComponent,
    ModalPersonaComponent,
    ModalRolComponent,
    ModalCasaComponent,
    ModalLoteComponent,
    ModalHabitacionComponent,
    ModalLocalComponent,
    ModalServicioComponent,
    ModalCocheraComponent,
    ModalApartamentoComponent,
    ModalApartamentocuartoComponent,
    ModalUsuarioComponent,
    ModalTipoubigeoComponent,
    ModalUbigeoComponent,
    ConfirmacionComponent
  ],
  providers: [
    NgbActiveModal,
    UtilService,
    CargaImagenesService
  ]
})
export class EmpresaModule { }
