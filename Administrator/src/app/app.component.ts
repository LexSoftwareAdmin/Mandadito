import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { TabsControllerPage } from "../pages/tabs-controller/tabs-controller";
import { CalificacionesPage } from '../pages/calificaciones/calificaciones';
import { PushnotificationProvider } from '../providers/pushnotification/pushnotification';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
    rootPage:any = "";

  constructor(private afDb :AngularFireDatabase, 
              private afAuth:AngularFireAuth, 
              platform: Platform, 
              private statusBar: StatusBar, 
              splashScreen: SplashScreen,
              public pushProvider : PushnotificationProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.overlaysWebView(true);
      this.statusBar.styleDefault();
      splashScreen.hide();
      this.afAuth.authState.subscribe(user =>{
        if(user){
          this.afDb.database.ref("admin/"+user.uid).once("value").then(data=>{
            if(data.val() != null ){
              this.notificacionesId(user.uid);
              this.rootPage = TabsControllerPage;

            }
            else{
              this.afAuth.auth.signOut();
            }
          });        
        }
        else{
          this.rootPage = LoginPage;
        }
      });
    });
  }

  goCalificacion(){
    this.navCtrl.push(CalificacionesPage);
  }

  async notificacionesId(id){
    console.log('hola');
    this.pushProvider.initOneSingal();
    let playerID = await this.pushProvider.obtenerId();
    this.afDb.database.ref('admin/'+id).update(playerID);
  }
  
}
 