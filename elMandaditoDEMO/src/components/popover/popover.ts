import { Component } from '@angular/core';
import { NavParams, NavController, ViewController } from 'ionic-angular';

import { EditarCarritoPage }from '../../pages/editar-carrito/editar-carrito';

import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { CarritoProvider } from '../../providers/carrito/carrito';



/**
 * Generated class for the PopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {

  userId;
  key;
  user;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private afDb: AngularFireDatabase,
              private afAuth : AngularFireAuth,
              public viewCtrl: ViewController,
              public _carrito: CarritoProvider) {
                
    this.key = this.navParams.get("id");
    this.user = this.navParams.get("user");
    console.log(this.key);

  }

  editar(){
    this.navCtrl.push(EditarCarritoPage, {id:this.key});
  }

  eliminar(){
    if(this.user){
      this.userId = this.afAuth.auth.currentUser.uid;
      this.navCtrl.pop();
      this.afDb.database.ref("carrito/"+this.userId+"/"+this.key).remove();
    }
    else{
      this._carrito.eliminarProducto(this.key);
      this.close();
    }

  }

  close(){
    this.viewCtrl.dismiss();
  }

}
