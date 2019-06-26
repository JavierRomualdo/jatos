import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectivePreloadingStrategy } from './selective-preloading-startegy';
import { Error404Component } from './componentesgenerales/error404/error404.component';
import { LoginComponent } from './componentesgenerales/login/login.component';
import { LoginService } from './servicios/login.service';
import { AuthGuardService } from './auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // { path: 'welcome', loadChildren: './modulos/welcome/welcome.module#WelcomeModule' },
  { path : 'empresa',
    canActivate: [AuthGuardService],
    loadChildren: './modulos/empresa/empresa.module#EmpresaModule'}, // canActivate: [AuthGuardService]
  { path: '', redirectTo: '/empresa', pathMatch: 'full' },
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        useHash : true,
        preloadingStrategy: SelectivePreloadingStrategy
      }
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [ LoginService, AuthGuardService,
    SelectivePreloadingStrategy
  ]
})

export class AppRoutingModule {
}
