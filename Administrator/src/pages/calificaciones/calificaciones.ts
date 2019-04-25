import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

import { PedidoPD01Page } from '../pedido-pd01/pedido-pd01';


/**
 * Generated class for the CalificacionesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calificaciones',
  templateUrl: 'calificaciones.html',
})
export class CalificacionesPage {

  calificaciones = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private afAuth: AngularFireAuth, 
              private afDb : AngularFireDatabase) {
    
    let idUser = this.afAuth.auth.currentUser.uid;
    this.afDb.list('pedidos/'+idUser).snapshotChanges().subscribe(data=>{
      data.map(data=>{
        let pedido = {...data.payload.val()}
        let usuario = data.key;
        for (const key in pedido) {
          if (pedido[key].hasOwnProperty('calificacion')) {
            let color = '';
            if(pedido[key]['calificacion']['estrellas'] > 3){
               color = 'verde';
            }
            else{
               color = 'rojo'
            } 
        
            this.calificaciones.push({...pedido[key], color: color, key : key, usuario: usuario })
          }
        }
      });

      console.log(this.calificaciones);
      
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalificacionesPage');
  }

  detalleProducto(key, usuario){
    this.navCtrl.push(PedidoPD01Page,{id: key, user:usuario});

  }

}
