import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { InfoPedidoPage } from '../info-pedido/info-pedido';
import { PedidosComponent } from '../../components/pedidos/pedidos';

import { MenutiendaPage } from '../menutienda/menutienda';
import { OneSignal } from '@ionic-native/onesignal';


/**
 * Generated class for the PedidosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pedidos',
  templateUrl: 'pedidos.html',
})
export class PedidosPage {

  pedidos = [];
  idUser;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private afAuth: AngularFireAuth, private afDb : AngularFireDatabase,
              private alertCtrl: AlertController,
              public popCtrl: PopoverController,
              private oneSignal: OneSignal) {
  
    this.idUser = this.afAuth.auth.currentUser.uid;
    this.afDb.list("pedidos").snapshotChanges().subscribe(data=>{
      this.pedidos = [];
      data.map(data=>{
        let objeto = data.payload.val();
        let tienda = data.key;
        objeto = {...objeto[this.idUser]};
        for (const key in objeto) {
          console.log(objeto);
          this.pedidos.push({key:key, tienda: tienda, estado: objeto[key]['estatus']});

        }
        console.log(this.pedidos);
      });
    });

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PedidosPage');
  }

  infoPedido(id, tienda){
    this.navCtrl.push(InfoPedidoPage,{id:id,tienda:tienda});
  }

  opciones(element, key, tienda){
    let popover = this.popCtrl.create(PedidosComponent,{key: key, tienda: tienda});
    popover.present({
      ev: element
    });
    popover.onDidDismiss(data=>{
      if(data){
        this.navCtrl.setRoot(MenutiendaPage);
        this.notificacion();
      }
    });
  }

  eliminar(id, tienda){
    let alert = this.alertCtrl.create({
      title: 'Cancelar pedido',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.afDb.database.ref("pedidos/"+tienda+"/"+this.idUser+"/"+id).remove();
          }
        }
      ]
    });
    alert.present();
  }

  notificacion(){
    let tienda = localStorage.getItem("tienda");
    this.afDb.database.ref('admin/'+tienda).once('value',data=>{
      let tienda = data.val();

      var notificationObj = { 
        app_id: "ed113f7f-9310-4b35-a774-332cbd72d05c",
        include_player_ids: [tienda['userId']],
        data: {"foo": "bar"},
        headings: {"en": "El mandadito"},
        contents: {"en": "Pedido Modificado"}
      };
    
      this.oneSignal.postNotification(notificationObj).then(data=>{
        console.log('funciono');
        console.log(JSON.stringify(data));
      }).catch(error=>{
        console.log('error');
        console.log(JSON.stringify(error));
      });
  
    });
    
  }

}
