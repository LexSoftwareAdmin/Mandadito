import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IniciodeSesionPage } from '../pages/iniciodesesion/iniciodesesion';
import { MisPreferenciasPage } from '../pages/mispreferencias/mispreferencias';
import { TiendaPage } from '../pages/tienda/tienda';
import { InformaciondelProductoPage } from '../pages/informaciondelproducto/informaciondelproducto';
import { MiCarritoPage } from '../pages/micarrito/micarrito';
import { ConfirmarDirecciondeEnvioPage } from '../pages/confirmardirecciondeenvio/confirmardirecciondeenvio';
import { EstatusPage } from '../pages/estatus/estatus';
import { RegistrarsePage } from '../pages/registrarse/registrarse';
import { PedidosPage } from '../pages/pedidos/pedidos';
import { PerfilPage } from '../pages/perfil/perfil';
import { NosotrosPage } from '../pages/nosotros/nosotros';
import { MenutiendaPage } from '../pages/menutienda/menutienda';


import { InicioPage } from '../pages/inicio/inicio';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { PushnotificationProvider } from '../providers/pushnotification/pushnotification';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
    rootPage:any = '';
    iniciado:boolean = false;

  constructor(private afAuth: AngularFireAuth, 
              private afDb : AngularFireDatabase,
              platform: Platform, 
              private statusBar: StatusBar, 
              splashScreen: SplashScreen,
              public modalCtrl: ModalController,
              public pushProvider : PushnotificationProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(true);
      splashScreen.hide();
      this.afAuth.authState.subscribe(user =>{
        if(user){
          this.afDb.database.ref('users/'+user.uid).once('value',data=>{
            if(data.val()){
              let ciudad = data.val()['ciudad'];
              this.iniciado = true;
              this.rootPage = MenutiendaPage;
              this.tienda(ciudad, user.uid);
              
            }

            else{
              this.rootPage = MisPreferenciasPage;
              this.iniciado = false;

            }

          });

         
        }
        else{
          this.rootPage = MisPreferenciasPage;
          this.iniciado = false;
        }
      });    
    });
  }

   async tienda(ciudad, user){
    this.pushProvider.initOneSingal();
    let playerID = await this.pushProvider.obtenerId();
    this.afDb.database.ref('users/'+user).update(playerID);
    let query = await this.afDb.database.ref("admin").orderByChild('nombre').equalTo(ciudad).once('value');
    let tienda = Object.keys(query.val());
    localStorage.removeItem("tienda");
    localStorage.setItem("tienda", tienda[0]);
    
  }

  goToInicio(params){
    if (!params) params = {};
    this.navCtrl.setRoot(MisPreferenciasPage);
  }goToIniciodeSesion(params){
    if (!params) params = {};
    this.navCtrl.setRoot(IniciodeSesionPage);
  }goToMisPreferencias(params){
    if (!params) params = {};
    this.navCtrl.setRoot(MisPreferenciasPage);
  }goToTienda(params){
    if (!params) params = {};
    this.navCtrl.setRoot(TiendaPage);
  }goToInformaciondelProducto(params){
    if (!params) params = {};
    this.navCtrl.setRoot(InformaciondelProductoPage);
  }goToMiCarrito(params){
    if (!params) params = {};
    this.navCtrl.setRoot(MiCarritoPage);
  }goToConfirmarDirecciondeEnvio(params){
    if (!params) params = {};
    this.navCtrl.setRoot(ConfirmarDirecciondeEnvioPage);
  }goToEstatus(params){
    if (!params) params = {};
    this.navCtrl.setRoot(EstatusPage);
  }goToRegistrarse(params){
    if (!params) params = {};
    this.navCtrl.setRoot(RegistrarsePage);
  }

  goLogin(){
    this.navCtrl.setRoot(InicioPage);
  }
  
  salir(){
    this.afAuth.auth.signOut();
  }

  pedidos(){
    this.navCtrl.push(PedidosPage);
  }

  perfil(){
    this.navCtrl.push(PerfilPage);
  }

  nosotros(){
    this.navCtrl.push(NosotrosPage);
  }
}
