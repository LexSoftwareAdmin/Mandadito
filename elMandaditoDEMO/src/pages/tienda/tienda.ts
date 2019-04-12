import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController} from 'ionic-angular';
import { InformaciondelProductoPage } from '../informaciondelproducto/informaciondelproducto';
import { MiCarritoPage } from '../micarrito/micarrito';
import { ConfirmarDirecciondeEnvioPage } from '../confirmardirecciondeenvio/confirmardirecciondeenvio';
import { EstatusPage } from '../estatus/estatus';
import { MenutiendaPage } from '../menutienda/menutienda';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

import { CaliicacionPage } from '../caliicacion/caliicacion';
import { OneSignal } from '@ionic-native/onesignal';





@Component({
  selector: 'pagetienda',
  templateUrl: 'tienda.html'
})
export class TiendaPage {
  
  
  rootPage:any = MenutiendaPage;
  productos = [];
  frut = [];
  verd = [];
  basic = [];
  keyTien:any;
  categor = "frutas";
  negocio = false;
  loading;

  constructor(public navCtrl: NavController, 
              public navPms: NavParams, 
              private afDb: AngularFireDatabase,
              private afAuth : AngularFireAuth,
              public modalCtrl: ModalController,
              public loadingCtrl: LoadingController,
              private oneSignal: OneSignal) {

      this.loading = this.loadingCtrl.create({
                      spinner: 'crescent',
                      content: 'Cargando...'
                });
                
      this.loading.present(); 
      this.afAuth.authState.subscribe( user =>{
        if(user){
          let idUser = this.afAuth.auth.currentUser.uid;
          this.afDb.list("pedidos").snapshotChanges().subscribe(data=>{
            let cali = false;
            let tienda;
            let pedido;
            data.map(data=>{
              let objeto = data.payload.val();
              objeto = {...objeto[idUser]};
              for (const key in objeto) {
                let estado = objeto[key]['estatus'];
                if(estado == 'Entregado'){
                  let calificacion = objeto[key].hasOwnProperty('calificacion');
                  if( !calificacion ){
                    cali = true;
                    tienda = data.key;
                    pedido = key;
                    break;
                  }
                }
              }
             
            });
            if(cali){
              let calificar = this.modalCtrl.create(CaliicacionPage, {
                tienda: tienda,
                pedido: pedido
              }, 
              {
                enableBackdropDismiss: false
              });
              calificar.present();
            }
          });

          this.mostrarProductosUser();

        }else{
          
          this.mostrarProductosAnonimo();
        }

      });
      
                          
      

  }
  
  infoProducto(key){
    this.navCtrl.push(InformaciondelProductoPage, {codigo: key, tienda: this.keyTien});
  }

  mostrarProductosUser(){
    this.keyTien = localStorage.getItem("tienda");
      console.log(this.keyTien);
      let userId = this.afAuth.auth.currentUser.uid;
      this.afDb.database.ref("users/"+userId).once("value",data=>{
        let categoria = data.val()['categoria'];
        if(categoria == 'negocio') this.negocio = true;
        else this.negocio = false;
        this.afDb.list("productos/"+this.keyTien).snapshotChanges().subscribe(data=>{
          this.frut = [];
          this.verd = [];
          this.basic = [];
          this.productos = data.map(data=>{
            let producto = {...data.payload.val(), key: data.key};
            switch (producto['categoPro']) {
                case 'Frutas':
                  this.frut.push(producto);
                break;
            
                case 'Verduras':
                this.verd.push(producto);
                
                break;
                case 'Basicos':
                this.basic.push(producto);
                
                break;
            }

          });

          this.frut.sort(function (a, b) {
            if( a.nombre > b.nombre){
              return 1;
            }
            if ( a.nombre < b.nombre){
              return -1;
            }

            return 0;
          });
          this.verd.sort(function (a, b) {
            if( a.nombre > b.nombre){
              return 1;
            }
            if ( a.nombre < b.nombre){
              return -1;
            }

            return 0;
          });
          this.basic.sort(function (a, b) {
            if( a.nombre > b.nombre){
              return 1;
            }
            if ( a.nombre < b.nombre){
              return -1;
            }

            return 0;
          });
          
          this.loading.dismiss();
                  
        });
      });
  }

  mostrarProductosAnonimo(){
    this.negocio = false;
    this.keyTien = localStorage.getItem("tienda");
    this.afDb.list("productos/"+this.keyTien).snapshotChanges().subscribe(data=>{
      this.frut = [];
      this.verd = [];
      this.basic = [];
      this.productos = data.map(data=>{
        let producto = {...data.payload.val(), key: data.key};
        switch (producto['categoPro']) {
            case 'Frutas':
              this.frut.push(producto);
            break;
        
            case 'Verduras':
            this.verd.push(producto);
            
            break;
            case 'Basicos':
            this.basic.push(producto);
            
            break;
        }

      });

      this.frut.sort(function (a, b) {
        if( a.nombre > b.nombre){
          return 1;
        }
        if ( a.nombre < b.nombre){
          return -1;
        }

        return 0;
      });
      this.verd.sort(function (a, b) {
        if( a.nombre > b.nombre){
          return 1;
        }
        if ( a.nombre < b.nombre){
          return -1;
        }

        return 0;
      });
      this.basic.sort(function (a, b) {
        if( a.nombre > b.nombre){
          return 1;
        }
        if ( a.nombre < b.nombre){
          return -1;
        }

        return 0;
      });
      
      this.loading.dismiss();
              
    });

  }

  
}
