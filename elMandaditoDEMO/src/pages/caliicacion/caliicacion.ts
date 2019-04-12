import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

import { MisPreferenciasPage } from '..//mispreferencias/mispreferencias';


/**
 * Generated class for the CaliicacionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-caliicacion',
  templateUrl: 'caliicacion.html',
})
export class CaliicacionPage {

  pedidos = [];
  total;
  idpedido;
  cali = 0;
  comentario:any = '';
  tienda;
  idUser;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private afAuth: AngularFireAuth, 
              private afDb : AngularFireDatabase,
              public toastCtrl: ToastController,
              public viewCtrl: ViewController) {

    this.tienda = this.navParams.get('tienda');
    this.idpedido = this.navParams.get('pedido');
    this.idUser = this.afAuth.auth.currentUser.uid;
    this.afDb.database.ref("pedidos/"+this.tienda+'/'+this.idUser+'/'+this.idpedido).once("value",data=>{
      let objeto = data.val()['carrito'];
      for (const key in objeto) {
        if (objeto[key].hasOwnProperty('nombre')) 
          this.pedidos.push(objeto[key]);
        if(key == 'total')
          this.total = objeto[key];
      }

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CaliicacionPage');
  }

  calificar(cali){
    this.cali = cali;
    const estrellas = document.getElementsByClassName('estrella');
    for (let index = 0; index < 5; index++) {
      estrellas[index].classList.remove("marcada");
      
    }
    for (let index = 0; index < cali; index++) {
      estrellas[index].classList.add("marcada");
      
    }

  }

  calificacion(){
    console.log(this.comentario);
    console.log(this.cali);
    if(this.cali == 0){
      const toast = this.toastCtrl.create({
        message: 'Califique con las estrellas',
        duration: 3000
      });
      toast.present();
    }else{

      let hora = Date.now();

      this.afDb.database.ref("pedidos/"+this.tienda+'/'+this.idUser+'/'+this.idpedido+'/calificacion').update({
          estrellas: this.cali,
          comentario: this.comentario,
          fechaRegistro: hora
      });

      this.viewCtrl.dismiss();

    }
  }

}
