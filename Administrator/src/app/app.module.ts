import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { PedidosPage } from '../pages/pedidos/pedidos';
import { InventarioPage } from '../pages/inventario/inventario';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { UsuariosPage } from '../pages/usuarios/usuarios';
import { LoginPage } from '../pages/login/login';
import { AltaDeNuevoProductoPage } from '../pages/alta-de-nuevo-producto/alta-de-nuevo-producto';
import { EditarInformaciNDelProductoPage } from '../pages/editar-informaci-ndel-producto/editar-informaci-ndel-producto';
import { PedidoPD01Page } from '../pages/pedido-pd01/pedido-pd01';
import { PedidoPD05Page } from '../pages/pedido-pd05/pedido-pd05';
import { PerfilDeClientePage } from '../pages/perfil-de-cliente/perfil-de-cliente';
import { CalificacionesPage } from '../pages/calificaciones/calificaciones';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { Camera } from '@ionic-native/camera';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import { OneSignal } from '@ionic-native/onesignal';
import { PushnotificationProvider } from '../providers/pushnotification/pushnotification';

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
    PedidosPage,
    InventarioPage,
    TabsControllerPage,
    UsuariosPage,
    LoginPage,
    AltaDeNuevoProductoPage,
    EditarInformaciNDelProductoPage,
    PedidoPD01Page,
    PedidoPD05Page,
    PerfilDeClientePage,
    CalificacionesPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PedidosPage,
    InventarioPage,
    TabsControllerPage,
    UsuariosPage,
    LoginPage,
    AltaDeNuevoProductoPage,
    EditarInformaciNDelProductoPage,
    PedidoPD01Page,
    PedidoPD05Page,
    PerfilDeClientePage,
    CalificacionesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    BluetoothSerial,
    OneSignal,
    PushnotificationProvider
  ]
})
export class AppModule {}