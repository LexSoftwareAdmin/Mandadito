import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { ConfirmarDirecciondeEnvioPage } from '../confirmardirecciondeenvio/confirmardirecciondeenvio';
import { EstatusPage } from '../estatus/estatus';
import { TiendaPage } from '../tienda/tienda';
import { InformaciondelProductoPage } from '../informaciondelproducto/informaciondelproducto';
import { EditarCarritoPage }from '../editar-carrito/editar-carrito';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

import { PopoverComponent } from '../../components/popover/popover';
import { CarritoProvider } from '../../providers/carrito/carrito';
import { RegistrarsePage } from '../registrarse/registrarse';



@Component({
  selector: 'pagemicarrito',
  templateUrl: 'micarrito.html'
})
export class MiCarritoPage {

  carrito = [];
  userId;
  total = 0;
  boton:boolean = false;
  envio = 15;
  user = false;

  constructor(public navCtrl: NavController,
              private afDb: AngularFireDatabase,
              private afAuth : AngularFireAuth,
              public popoverCtrl: PopoverController,
              public _carrito: CarritoProvider) {
     
   
  }

  ionViewWillEnter() {
    console.log('hola');

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
  mostrarAnonimo(){
    this.total = 0; 
    this.carrito = this._carrito.getProductos();
    this.carrito.map(data=>{
      console.log(data);
      this.total += parseFloat(data.cantidad) * parseFloat(data.precioMen);
    });
    if (this.carrito.length == 0 ){
      this.boton = false;
    }
    else{
     this.total += this.envio;
      this.boton = true;
    }
  }
  
  mostrarUser(){
    this.userId = this.afAuth.auth.currentUser.uid;
    this.afDb.list("carrito/"+this.userId).snapshotChanges().subscribe(data=>{
     this.total = 0; 
     this.carrito =  data.map(data=>({...data.payload.val(), key: data.key}));
     this.carrito.map(data=>{
       this.total += parseFloat(data.cantidad) * parseFloat(data.precioMen);
     });
     if (this.carrito.length == 0 ){
       this.boton = false;
     }
     else{
      this.total += this.envio;
       this.boton = true;
     }

      
    });

  }
  eliminar(id){
    this.afDb.database.ref("carrito/"+this.userId+"/"+id).remove();

  }
  goToConfirmarDirecciondeEnvio(){
    if( this.user ){
      this.navCtrl.push(ConfirmarDirecciondeEnvioPage,{total: this.total});
    }
    else{
      this.navCtrl.push(RegistrarsePage);
    }
  }

  editar(id){
    this.navCtrl.push(EditarCarritoPage, {id:id});
  }

  slide(element, key){
    console.log(key);
    let popover = this.popoverCtrl.create(PopoverComponent,{id:key, user: this.user});
    popover.present({
      ev: element
    });
    popover.onDidDismiss(()=>{
      if( !this.user  ){
          this.mostrarAnonimo();
      }
    });



  }

}
