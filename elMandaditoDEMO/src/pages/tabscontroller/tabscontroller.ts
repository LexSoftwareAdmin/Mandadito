import { Component, ViewChild } from '@angular/core';
import { NavController, Tabs } from 'ionic-angular';
import { TiendaPage } from '../tienda/tienda';
import { MiCarritoPage } from '../micarrito/micarrito';

import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

import { CarritoProvider } from '../../providers/carrito/carrito';


@Component({
  selector: 'page-tabscontroller',
  templateUrl: 'tabscontroller.html'
})
export class TabsControllerPage {

  @ViewChild('myTabs') tabRef: Tabs;

  tab1Root;
  tab2Root;
  badgeSurtiendo:any = 0;

  constructor(public navCtrl: NavController,private afDb: AngularFireDatabase,
    private afAuth : AngularFireAuth,
    public _carrito: CarritoProvider) {
    this.tab1Root = TiendaPage;
    this.tab2Root = MiCarritoPage;
    let userId = this.afAuth.auth.currentUser.uid;
    this.afDb.list("carrito/"+userId).snapshotChanges().subscribe(data=>{
      console.log(data.length);
    });
  }

  ionViewDidEnter() {
    this.tabRef.select(1);
   }
  
}
