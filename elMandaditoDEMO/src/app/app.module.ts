import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { TiendaPage } from '../pages/tienda/tienda';
import { MiCarritoPage } from '../pages/micarrito/micarrito';
import { TabsControllerPage } from '../pages/tabscontroller/tabscontroller';
import { InicioPage } from '../pages/inicio/inicio';
import { IniciodeSesionPage } from '../pages/iniciodesesion/iniciodesesion';
import { MisPreferenciasPage } from '../pages/mispreferencias/mispreferencias';
import { InformaciondelProductoPage } from '../pages/informaciondelproducto/informaciondelproducto';
import { ConfirmarDirecciondeEnvioPage } from '../pages/confirmardirecciondeenvio/confirmardirecciondeenvio';
import { EstatusPage } from '../pages/estatus/estatus';
import { RegistrarsePage } from '../pages/registrarse/registrarse';
import { EditarCarritoPage } from '../pages/editar-carrito/editar-carrito';
import { PerfilPage } from '../pages/perfil/perfil';
import { PedidosPage } from '../pages/pedidos/pedidos';
import {InfoPedidoPage } from '../pages/info-pedido/info-pedido';
import { NosotrosPage } from '../pages/nosotros/nosotros';
import { CaliicacionPage } from '../pages/caliicacion/caliicacion';


import { MenutiendaPage } from '../pages/menutienda/menutienda';
import { CallNumber } from '@ionic-native/call-number';
import { Camera } from '@ionic-native/camera';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { PopoverComponent } from '../components/popover/popover';
import { PedidosComponent } from '../components/pedidos/pedidos';

import { OneSignal } from '@ionic-native/onesignal';
import { PushnotificationProvider } from '../providers/pushnotification/pushnotification';
import { CarritoProvider } from '../providers/carrito/carrito';




export const firebaseConfig = {
    apiKey: "AIzaSyAvE4cO_aJCfJzd7tBJzUvtNr5ZeQt29To",
    authDomain: "el-mandadito-7f631.firebaseapp.com",
    databaseURL: "https://el-mandadito-7f631.firebaseio.com",
    projectId: "el-mandadito-7f631",
    storageBucket: "el-mandadito-7f631.appspot.com",
    messagingSenderId: "83052644678",
    appId: "1:83052644678:web:d4df55abc45c036c"
};

@NgModule({
  declarations: [
    MyApp,
    TiendaPage,
    MiCarritoPage,
    TabsControllerPage,
    MenutiendaPage,
    InicioPage,
    IniciodeSesionPage,
    MisPreferenciasPage,
    InformaciondelProductoPage,
    ConfirmarDirecciondeEnvioPage,
    EstatusPage,
    RegistrarsePage,
    EditarCarritoPage,
    PerfilPage,
    PedidosPage,
    InfoPedidoPage,
    NosotrosPage,
    PopoverComponent,
    PedidosComponent,
    CaliicacionPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TiendaPage,
    MiCarritoPage,
    TabsControllerPage,
    MenutiendaPage,
    InicioPage,
    IniciodeSesionPage,
    MisPreferenciasPage,
    InformaciondelProductoPage,
    ConfirmarDirecciondeEnvioPage,
    EstatusPage,
    RegistrarsePage,
    EditarCarritoPage,
    PerfilPage,
    PedidosPage,
    InfoPedidoPage,
    NosotrosPage,
    PopoverComponent,
    PedidosComponent,
    CaliicacionPage
  ],
  providers: [
    CallNumber,
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    OneSignal,
    PushnotificationProvider,
    CarritoProvider
    
  ]
})
export class AppModule {}