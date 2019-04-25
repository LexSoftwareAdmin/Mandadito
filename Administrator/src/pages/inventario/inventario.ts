import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { AltaDeNuevoProductoPage } from '../alta-de-nuevo-producto/alta-de-nuevo-producto';
import { EditarInformaciNDelProductoPage } from '../editar-informaci-ndel-producto/editar-informaci-ndel-producto';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'page-inventario',
  templateUrl: 'inventario.html'
})
export class InventarioPage {

  productos = [];
  frut = [];
  verd = [];
  basic = [];
  idUser:any;
  categor = "frutas";


  constructor(public navCtrl: NavController, 
              private afDatabase: AngularFireDatabase,
              private afAuth:AngularFireAuth,
              public alertCtrl: AlertController,
              private afStorage: AngularFireStorage,
              public loadingCtrl: LoadingController) {

      let loading = this.loadingCtrl.create({
                      spinner: 'crescent',
                      content: 'Cargando...'
                    });
            
      loading.present();  
      this.idUser = this.afAuth.auth.currentUser.uid;
      this.afDatabase.list("productos/"+this.idUser).snapshotChanges().subscribe(data =>{
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
          loading.dismiss();
          
        });
       
  }
  goToAltaDeNuevoProducto(params){
    if (!params) params = {};
    this.navCtrl.push(AltaDeNuevoProductoPage);
  }
  goToEditarInformaciNDelProducto(key){
    console.log(key);
    this.navCtrl.push(AltaDeNuevoProductoPage,{
      key: key
    });
  }
  eliminar(key){
    const confirmacion = this.alertCtrl.create({
      title: '¿Esta seguro?',
      message: 'Se borrara el producto de manera permanente y no se podra recuperar',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.afDatabase.database.ref("productos/"+this.idUser+"/"+key).remove();
            this.afStorage.ref('admin/'+this.idUser+'/productos/'+key).delete().subscribe(data=>{
              console.log(data);
            });
            
          }
        }
      ]
    });
    confirmacion.present();
  }
}
