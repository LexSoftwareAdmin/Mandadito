import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

/**
 * Generated class for the InfoPedidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-info-pedido',
  templateUrl: 'info-pedido.html',
})
export class InfoPedidoPage {
  keyTien:any;
  carrito ={};
  direccion = {
    nomCalle :'',
    nomColonia: '',
    telefono: '',
    cp: '',
    remitente: '',
    bod: true
  };
  estado:any;
  productos = [];
  total = 0;
  id:any;
  suscribir;
  envio = 15;
  envioCond: boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private afAuth: AngularFireAuth, 
              private afDb : AngularFireDatabase) {
    this.id = this.navParams.get("id");
    let tienda = this.navParams.get("tienda");
    let user = this.afAuth.auth.currentUser.uid;
    let query = this.afDb.object("pedidos/"+tienda+'/'+user+'/'+this.id).snapshotChanges();
    this.suscribir = query.subscribe(data=>{
      this.carrito = {...data.payload.val()['carrito']};
      this.direccion = {...data.payload.val()['direccion']};
      this.estado = data.payload.val()['estatus'];
      for (const key in this.carrito) {
        console.log(key);
        if(key == 'total'){
          this.total = this.carrito[key];
        }else{
          this.productos.push(this.carrito[key]);
        }
      }
      if (this.direccion.bod){
        this.envioCond = false;
      }else{
        this.envioCond = true;
      }


    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPedidoPage');
  }

  ionViewDidLeave(){
    this.suscribir.unsubscribe();
  }

}
