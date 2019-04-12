import { Component } from '@angular/core';
import { NavController, NavParams,AlertController , ToastController } from 'ionic-angular';
import { MiCarritoPage } from '../micarrito/micarrito';
import { ConfirmarDirecciondeEnvioPage } from '../confirmardirecciondeenvio/confirmardirecciondeenvio';
import { EstatusPage } from '../estatus/estatus';
import { TiendaPage } from '../tienda/tienda';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

import { InicioPage } from '../inicio/inicio';
import { CarritoProvider } from '../../providers/carrito/carrito';



@Component({
  selector: 'pageinformaciondelproducto',
  templateUrl: 'informaciondelproducto.html'
})
export class InformaciondelProductoPage {


  producto = {};
  cantidad:any;
  cantidadOtra:any;
  categoSeleccion: boolean = false;
  key:any;
  otro:boolean = false;
  boton:boolean = false;
  entero:boolean = false;
  categoria = '';
  precio = 0;
  sugerencia = '';
  user: boolean = false;

  constructor(public navCtrl: NavController, public navParams : NavParams,
              private afDb: AngularFireDatabase,
              private afAuth : AngularFireAuth,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public _carrito: CarritoProvider) {
    this.key = this.navParams.data;
    this.afAuth.authState.subscribe( user =>{
      if(user){
        this.user = true;
        this.mostrarUser();

      }
      else{
        this.user = false;
        this.mostrarAnonimo();
      }
    });
 
    

  }

  mostrarUser(){
    let userId = this.afAuth.auth.currentUser.uid;
    this.afDb.database.ref("users/"+userId).once("value",data=>{
      this.categoria = data.val()['categoria'];
      this.afDb.object("productos/"+this.key.tienda+'/'+this.key.codigo).snapshotChanges().subscribe(data=>{
        this.producto = {...data.payload.val(), key: data.key};
        let medida = data.payload.val()['unidadMed'];
        if(this.categoria == 'negocio') this.precio = this.producto['precioMay'];
        else this.precio = this.producto['precioMen'];
        if (medida == 'Pieza' || medida  == 'Charola' || medida == 'Domo' || medida == 'Arpilla' ) this.entero = true;
        
      });
    });
  }

  mostrarAnonimo(){
    this.categoria = 'particular';
    this.afDb.object("productos/"+this.key.tienda+'/'+this.key.codigo).snapshotChanges().subscribe(data=>{
      this.producto = {...data.payload.val(), key: data.key};
      let medida = data.payload.val()['unidadMed'];
      if(this.categoria == 'negocio') this.precio = this.producto['precioMay'];
      else this.precio = this.producto['precioMen'];
      if (medida == 'Pieza' || medida  == 'Charola' || medida == 'Domo' || medida == 'Arpilla' ) this.entero = true;
      
    });
  }

  addCantidad(canti){
      let select = document.getElementsByClassName("select-text");
      if(canti == "Otro"){
        this.otro = true;
        this.boton = false;
        this.cantidad = '';
      }
      else{
        this.cantidad = this.cantidadOtra;
        this.otro = false;
        this.boton = true;
        select[0].innerHTML = (this.cantidad +" " + this.producto['unidadMed']);
      }
    
  }

  addSelect(e){
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

  addCarrito(){
    if( this.user ){

      let userId = this.afAuth.auth.currentUser.uid;
      this.afDb.database.ref("carrito/"+userId+'/'+this.key.codigo).once("value",data=>{
        let producto = data.val();
        if(producto){
          const confirm = this.alertCtrl.create({
            title: 'Producto repetido',
            message: '',
            buttons: [
              {
                text: 'Duplicar',
                handler: () => {
                  producto.cantidad = parseFloat(this.cantidad);
                  this.afDb.database.ref("carrito/"+userId).push({
                    nombre : this.producto['nombre'], 
                    categoPro : this.producto['categoPro'],
                    precioMen: this.precio,
                    unidadMed: this.producto['unidadMed'],
                    url: this.producto['url'],
                    cantidad : parseFloat(this.cantidad),
                    sugerencia: this.sugerencia
                  });
                  this.sucess();
                }
              },
              {
                text: 'Añadir',
                handler: () => {
                  producto.cantidad += parseFloat(this.cantidad);
                  this.afDb.database.ref("carrito/"+userId+'/'+this.key.codigo).update({
                    nombre : this.producto['nombre'], 
                    categoPro : this.producto['categoPro'],
                    precioMen: this.precio,
                    unidadMed: this.producto['unidadMed'],
                    url: this.producto['url'],
                    cantidad : producto.cantidad,
                    sugerencia: this.sugerencia
                  });
                  this.sucess();
                }
              }
            ]
          });
          confirm.present();
          
  
        }else{
          this.afDb.database.ref("carrito/"+userId+'/'+this.key.codigo).set({
            nombre : this.producto['nombre'], 
            categoPro : this.producto['categoPro'],
            precioMen: this.precio,
            unidadMed: this.producto['unidadMed'],
            url: this.producto['url'],
            cantidad : parseFloat(this.cantidad),
            sugerencia: this.sugerencia
          });
          this.sucess();
        }
      });
    }
    else{
      let producto = {
          key: this.key.codigo,
          nombre : this.producto['nombre'], 
          categoPro : this.producto['categoPro'],
          precioMen: this.precio,
          unidadMed: this.producto['unidadMed'],
          url: this.producto['url'],
          cantidad : parseFloat(this.cantidad),
          sugerencia: this.sugerencia
      };

      let productos = this._carrito.getProductos();
      let repetido = false;
      productos.map(data=>{
        if(data['key'] == producto['key']){
          repetido = true;
          const confirm = this.alertCtrl.create({
            title: 'Producto repetido',
            message: '',
            buttons: [
              {
                text: 'Duplicar',
                handler: () => {
                  let producto = {
                    key: this.key.codigo+'duplicado',
                    nombre : this.producto['nombre'], 
                    categoPro : this.producto['categoPro'],
                    precioMen: this.precio,
                    unidadMed: this.producto['unidadMed'],
                    url: this.producto['url'],
                    cantidad : parseFloat(this.cantidad),
                    sugerencia: this.sugerencia,
                    repetido: true
                  };
                  this._carrito.agregaProducto(producto);
                  this.sucess();
                }
              },
              {
                text: 'Añadir',
                handler: () => {
                  let producto = {
                    key: this.key.codigo,
                    cantidad : parseFloat(this.cantidad),
                    sugerencia: this.sugerencia

                  };
                  this._carrito.agregarEditado(producto);
                  this.sucess();
                }
              }
            ]
          });
          confirm.present();
        }
      });

      if ( !repetido ){
        this._carrito.agregaProducto(producto);
        this.sucess();

      }


    }
    
  }

  sucess(){
    const alert = this.alertCtrl.create({
      subTitle: 'Producto agregado',
      buttons: ['OK']
    });
    alert.present();
    this.navCtrl.pop();
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
