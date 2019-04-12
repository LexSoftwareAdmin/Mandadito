import { Component } from '@angular/core';
import { NavParams, NavController, ViewController, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

/**
 * Generated class for the PedidosComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'pedidos',
  templateUrl: 'pedidos.html'
})
export class PedidosComponent {

  userId;
  key;
  tienda;

  constructor(public navParams: NavParams,
    private afDb: AngularFireDatabase,
    private afAuth : AngularFireAuth,
    private alertCtrl: AlertController,
    public viewCtrl: ViewController) 
    {

      this.key = this.navParams.get("key");
      this.tienda = this.navParams.get("tienda");
      console.log(this.key);
      console.log(this.tienda);
  }

  eliminar(){
    let idUser = this.afAuth.auth.currentUser.uid;
    let alert = this.alertCtrl.create({
      title: 'Cancelar pedido',
      subTitle: 'Tu pedido se borrara y no se podra recuperar.',
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
            this.afDb.database.ref("pedidos/"+this.tienda+"/"+idUser+"/"+this.key).remove();
            this.viewCtrl.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  editar(){
    let idUser = this.afAuth.auth.currentUser.uid;
    let alert = this.alertCtrl.create({
      title: 'Editar pedido',
      subTitle: 'Tus articulos regresaran al carrito.',
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
            this.afDb.database.ref("pedidos/"+this.tienda+'/'+idUser+'/'+this.key).once("value",data=>{
              let carrito = {...data.val()['carrito']};
              let newCarrito = {};
              for (const key in carrito) {
                if(key != "total"){
                  newCarrito[key] = carrito[key]; 
                }
              }
              this.afDb.database.ref('carrito/'+idUser).set(newCarrito);
              this.afDb.database.ref("pedidos/"+this.tienda+'/'+idUser+'/'+this.key).remove();
              this.viewCtrl.dismiss({
                editar: true
              });
            });
          }
        }
      ]
    });
    alert.present();
  }

}
