import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogModule } from 'primeng/dialog';
// import { MensajeModalComponent } from './mensaje-modal/mensaje-modal.component';
// import { SpanMensajeComponent } from './span-mensaje/span-mensaje.component';
// import { SpanAccionComponent } from './span-accion/span-accion.component';
// import { IconAccionComponent } from './icon-accion/icon-accion.component';
// import { BotonOpcionesComponent } from './boton-opciones/boton-opciones.component';
// import { TooltipReaderComponent } from './tooltip-reader/tooltip-reader.component';
// import { PinnedCellComponent } from './pinned-cell/pinned-cell.component';
// import { ImagenAccionComponent } from './imagen-accion/imagen-accion.component';
// import { InputEstadoComponent } from './input-estado/input-estado.component';

@NgModule({
  declarations: [
  // InputEstadoComponent
// ImagenAccionComponent
// BotonOpcionesComponent,
//   TooltipReaderComponent,
//   PinnedCellComponent
// IconAccionComponent
// SpanAccionComponent
// SpanMensajeComponent
// MensajeModalComponent
],
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    DialogModule
  ],
  exports: [
  ],
  entryComponents: [
  ],
  providers: []
})
export class ComponentesModule { }
