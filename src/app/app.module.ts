import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from './app-routing.module';
import { TabViewModule } from "primeng/tabview";
import { TooltipModule } from 'primeng/tooltip';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AppConfig } from './app-config';
import { ApiRequestService } from './servicios/api-request.service';
import { ApiRequest2Service } from './servicios/api-request2.service';
import { AuthService } from './servicios/auth.service';
import { AuthGuardService } from './auth-guard.service';
import { LoginService } from './login.service';
import { LoginComponent } from './componentesgenerales/login/login.component';
import { Error404Component } from './componentesgenerales/error404/error404.component';
import { ToastrModule } from 'ngx-toastr';
// import { Autonumeric2Directive } from './directivas/autonumeric2/autonumeric2.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    Error404Component,
    // Autonumeric2Directive
  ],
  exports: [
    Error404Component
  ],
  imports: [
    FormsModule,
    ToastrModule.forRoot({
      closeButton: true
    }),
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    TabViewModule,
    TooltipModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule // imports firebase/storage only needed for storage features
  ],
  providers: [
    AppConfig,
    ApiRequestService,
    ApiRequest2Service,
    AuthService,
    LoginService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
