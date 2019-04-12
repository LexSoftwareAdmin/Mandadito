import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { TabsControllerPage } from '../tabscontroller/tabscontroller';
import { InformaciondelProductoPage } from '../informaciondelproducto/informaciondelproducto';
import { MiCarritoPage } from '../micarrito/micarrito';
import { ConfirmarDirecciondeEnvioPage } from '../confirmardirecciondeenvio/confirmardirecciondeenvio';
import { EstatusPage } from '../estatus/estatus';
import { MenutiendaPage } from '../menutienda/menutienda';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';





@Component({
  selector: 'pagemispreferencias',
  templateUrl: 'mispreferencias.html'
})
export class MisPreferenciasPage {

  preferencias = [];
  tienda = '';

  constructor(public navCtrl: NavController,
              private afDb: AngularFireDatabase,
              public menuCtrl: MenuController,
              private afAuth: AngularFireAuth) {

    this.menuCtrl.swipeEnable(true);            

    this.afDb.database.ref("admin").once("value",data=>{
      let info = data.val();
      for (const key in info ) {
        this.preferencias.push({nombre: info[key].nombre, key:key});
      }
    });


    
  }
  goToTienda(){
    localStorage.removeItem("tienda");
    localStorage.setItem("tienda", this.tienda);
    this.navCtrl.push(MenutiendaPage);
  }
}
