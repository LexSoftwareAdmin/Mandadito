import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, ViewController } from 'ionic-angular';
import { MenutiendaPage } from '../menutienda/menutienda';
import { TiendaPage } from '../tienda/tienda';
import { InformaciondelProductoPage } from '../informaciondelproducto/informaciondelproducto';
import { MiCarritoPage } from '../micarrito/micarrito';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { app } from 'firebase';
import { OneSignal } from '@ionic-native/onesignal';


@Component({
  selector: 'pageconfirmardirecciondeenvio',
  templateUrl: 'confirmardirecciondeenvio.html'
})
export class ConfirmarDirecciondeEnvioPage {

  dir = {
    nomCalle: '',
    cp: '',
    nomColonia: '',
    telefono: '',
    remitente : '',
    fac: false,
    bod: false,
    metPago: '',
    usuario: '',
    categoria: '',
    sugerencia: ''
  };
  userId:any;
  total:any;
  otroMet:boolean = false;
  otroMetodo:string;

  constructor(public navCtrl: NavController,
    private afDb: AngularFireDatabase,
    private afAuth : AngularFireAuth,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private oneSignal: OneSignal) {

      this.userId = this.afAuth.auth.currentUser.uid;
      this.total = this.navParams.get("total");
      this.afDb.database.ref("users/"+this.userId).once("value",data=>{
        console.log(data.val());
        this.dir.nomCalle = data.val().calleNum;
        this.dir.cp = data.val().cp;
        this.dir.nomColonia = data.val().colonia;
        this.dir.telefono = data.val().telefono;
        this.dir.remitente = data.val().nomRem;
        this.dir.metPago = data.val().MetPago;
      });

  }

  especificarMet(e){
    if(e == "Otro"){
      this.otroMet = true;
    }
    else{
      this.otroMet = false;
    }
  }

  goToEstatus(){
    if(this.otroMet){
      this.dir.metPago = this.otroMetodo;
    }
    console.log(this.userId);
    if( this.dir.bod ){
      this.total -= 15;
    }
    this.afDb.database.ref("carrito/"+this.userId+"/").update({
      total: this.total
    });
      let tienda = localStorage.getItem("tienda");
      this.afDb.database.ref("carrito/"+this.userId).once("value",data=>{
        let carrito = data.val();
        let direccion = this.dir;
        this.afDb.database.ref("users/"+this.userId).once("value",data=>{
          let nombre = data.val().nom;
          let apPat = data.val().apPat;
          let apMat = data.val().apMat
          let categoria = data.val().categoria;
          let hora = new Date();
          let dia = hora.getDate();
          let mes = hora.getMonth() + 1;
          let year = hora.getFullYear();
          let hour = hora.getHours();
          let minuto = hora.getMinutes(); 
          let codigo = nombre[0] + apPat[0] + apMat[0] + '-' + year + mes + dia + hour + minuto;
          direccion.usuario = nombre + " " + apPat + " " + apMat;
          direccion.categoria = categoria;
          this.afDb.database.ref("pedidos/"+tienda+'/'+this.userId+'/'+codigo).set({
            carrito:{
              ...carrito
            },
            direccion:{
              ...direccion
            },
            estatus: 'Surtiendo',
            notificado: false 
          });
          this.afDb.database.ref("carrito/"+this.userId).remove();
          const alert = this.alertCtrl.create({
            title: 'Muchas Gracias',
            subTitle: 'Ya estamos surtiendo su pedido',
            buttons: ['OK']
          });
          alert.present();
          this.notificacion();
          this.navCtrl.pop();

        });
        
      });
      
  }

  revisarDatos(){
    if( this.dir.nomCalle == '' || this.dir.cp == '' || this.dir.nomColonia == '' || 
        this.dir.telefono == '' || this.dir.remitente == '' ){
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Llene todo los campos porfavor',
        buttons: ['OK']
      });
      alert.present();
    }
    else{
      this.goToEstatus();
    }
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
        contents: {"en": "Nuevo Pedido"}
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
