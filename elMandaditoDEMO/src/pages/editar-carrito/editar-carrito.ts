import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

import { CarritoProvider } from '../../providers/carrito/carrito';


/**
 * Generated class for the EditarCarritoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-editar-carrito',
  templateUrl: 'editar-carrito.html',
})
export class EditarCarritoPage {

  producto;
  cantidad:any;
  key:any;
  otro:boolean = true;
  boton:boolean = false;
  entero:boolean = false;
  suscribir;
  user = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private afAuth:AngularFireAuth, private afDb: AngularFireDatabase,
              public alertCtrl : AlertController,
              public toastCtrl: ToastController,
              public _carrito: CarritoProvider) {

    this.key = this.navParams.get("id");
    this.afAuth.authState.subscribe(user=>{

      if(user){
        this.user = true;
        this.entero = false;
        this.mostrarUser();
      }
      else{
        this.user = false;
        this.mostrarAnonimo();
      }
    });
    
   
  }

  async mostrarUser(){
    debugger;
    let usuario = this.afAuth.auth.currentUser.uid;
    let query = await this.afDb.database.ref("carrito/"+usuario+"/"+this.key).once('value');
      this.producto = query.val();
      console.log(this.producto);
      this.cantidad = this.producto['cantidad'];
      let select = document.getElementsByClassName("select-text");
      select[0].innerHTML = (this.cantidad +" " + this.producto['unidadMed']);
      if (this.producto['unidadMed'] == 'Pieza' || this.producto['unidadMed'] == 'Charola' ||
          this.producto['unidadMed'] == 'Domo' || this.producto['unidadMed'] == 'Arpilla' ) this.entero = true;

  }

  mostrarAnonimo(){
    let producto = this._carrito.getProductos();
    producto.map(data=>{
      if( data['key'] == this.key){
        this.producto = data;
      }
    });
    console.log(producto);
    console.log(this.producto);
    this.cantidad = this.producto['cantidad'];
    let select = document.getElementsByClassName("select-text");
    select[0].innerHTML = (this.cantidad +" " + this.producto['unidadMed']);
    if (this.producto['unidadMed'] == 'Pieza' || this.producto['unidadMed'] == 'Charola' ||
        this.producto['unidadMed'] == 'Domo' || this.producto['unidadMed'] == 'Arpilla' ) 
        this.entero = true;
 

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditarCarritoPage');
  }

  addCantidad(canti){
    let select = document.getElementsByClassName("select-text");
    if(canti == "Otro"){
      this.otro = true;
      this.boton = false;
      this.cantidad = '';
    }
    else{
      this.cantidad = canti;
      select[0].innerHTML = (this.cantidad +" " + this.producto['unidadMed']);
      this.otro = false;
      this.boton = true;
    }
    
  }

  addSelect(){
    let select = document.getElementsByClassName("select-text");
    if(this.cantidad == '' || this.cantidad == 0){
      select[0].innerHTML = ("Otro");
      this.boton = false;

    }
    else{
    select[0].innerHTML = (this.cantidad +" " + this.producto['unidadMed']);
    this.boton = true;

    }    
  }

  editar(){
    this.producto['cantidad'] = parseFloat(this.cantidad);
    if ( this.user ){
      let userId = this.afAuth.auth.currentUser.uid;
      this.afDb.database.ref("carrito/"+userId+'/'+this.key).update(this.producto);
      const alert = this.alertCtrl.create({
        title: 'Muy bien',
        subTitle: 'Producto Editado',
        buttons: ['OK']
      });
      alert.present();
      setTimeout(() => {
        this.navCtrl.pop();
        this.navCtrl.pop();
      }, 1200);

    }

    else{

      this._carrito.guardar_productos();

      const alert = this.alertCtrl.create({
        title: 'Muy bien',
        subTitle: 'Producto Editado',
      });
      alert.present();
      setTimeout(() => {
        this.navCtrl.pop();
        this.navCtrl.pop();
        this.navCtrl.pop();
      }, 500);

    }

  }

  noPunto(e){

    if(this.entero){
      let expReg = /\D/;
      let expresion = expReg.test(this.cantidad);
      if ( expresion ) {
        let tem = '';
        for (let index = 0; index < this.cantidad.length - 2 ; index++) {
          tem += this.cantidad[index];
        
        }
        const toast = this.toastCtrl.create({
          message: 'Solo cantidades enteras',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      this.cantidad = tem;
      
    }

    }
  
  }

}
