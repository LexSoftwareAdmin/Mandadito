import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { TiendaPage } from '../tienda/tienda';
import { MiCarritoPage } from '../micarrito/micarrito';

import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

import { CarritoProvider } from '../../providers/carrito/carrito';


/**
 * Generated class for the MenutiendaPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menutienda',
  templateUrl: 'menutienda.html'
})
export class MenutiendaPage {

  @ViewChild('myTabs') tabRef: Tabs;


  tiendaRoot:any  = TiendaPage;
  carritoRoot:any = MiCarritoPage;
  badgeSurtiendo:any = 0;
  user = false;
  productos = [];


  constructor(public navCtrl: NavController, public navPms: NavParams, private afDb: AngularFireDatabase,
    private afAuth : AngularFireAuth,
    public _carrito: CarritoProvider) {
      this.afAuth.authState.subscribe(user =>{
        if(user){
          this.user = true;
          let userId = this.afAuth.auth.currentUser.uid;
          this.afDb.list("carrito/"+userId).snapshotChanges().subscribe(data=>{
            this.productos = data;
        });
          }
          else{
            this.productos = this._carrito.productos;

          }
         
      });
    
    }


    ionViewDidEnter() {
      this.tabRef.select(0);
     }


}
