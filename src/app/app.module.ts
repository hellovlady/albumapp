import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { Storage, Drivers  } from '@ionic/storage';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth/auth.service';
import { AuthModule } from './services/auth/auth.module';
import { NativeHttpModule, NativeHttpBackend, NativeHttpFallback } from 'ionic-native-http-connection-backend';
import { HttpBackend, HttpXhrBackend } from '@angular/common/http';
import { Contacts } from '@ionic-native/contacts/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
    }),
    AppRoutingModule,
    HttpClientModule,
    AuthModule,
    NativeHttpModule,
  ],
  providers: [
    { provide: HttpBackend,
      useClass: NativeHttpFallback,
      deps: [Platform, NativeHttpBackend, HttpXhrBackend]
    },
    Contacts,
    // { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SocialSharing,
    HTTP,
    File,
    Storage,
    AuthGuardService,
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}


