import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, Platform, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { PedidosPage } from '../pedidos/pedidos';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import { OneSignal } from '@ionic-native/onesignal';


@Component({
  selector: 'page-pedido-pd01',
  templateUrl: 'pedido-pd01.html'
})
export class PedidoPD01Page {
  keyTien:any;
  carrito ={};
  direccion = {
    nomCalle :'',
    nomColonia: '',
    telefono: '',
    cp: '',
    remitente: '',
    metPago: '',
    fac: false,
    bod: false,
    usuario: '',
    categoria: '',
    sugerencia: ''
  };
  estado:any;
  productos = [];
  total = 0;
  id:any;
  user:any;
  otroMet:boolean = false;
  otroMetodo:string;
  categoria:any;
  suscribir;
  imprimir:boolean = false;
  envio = 15;
  envioCond: boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private afDb: AngularFireDatabase,
              private afAuth : AngularFireAuth,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              private bluetooth: BluetoothSerial,
              public platform : Platform,
              private loadCtrl: LoadingController,
              private oneSignal: OneSignal) {
    
    if(this.platform.is('android')) this.imprimir = true;            
    this.user = this.navParams.get("user");
    this.id = this.navParams.get("id");
    this.keyTien = this.afAuth.auth.currentUser.uid;
    let query = this.afDb.object("pedidos/"+this.keyTien+'/'+this.user+'/'+this.id).snapshotChanges();
    this.suscribir = query.subscribe(data=>{
      this.carrito = {...data.payload.val()['carrito']};
      this.direccion = {...data.payload.val()['direccion']};
      this.categoria = this.direccion['categoria'];
      this.estado = data.payload.val()['estatus'];
      console.log(this.direccion);
      if(this.direccion["metPago"] == 'Otro' ){
          this.otroMetodo = this.direccion["metPago"];
          this.otroMet = true;
        }
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

  cambiarEstado(e){
    this.afDb.database.ref("pedidos/"+this.keyTien+'/'+this.user+'/'+this.id).update({
      estatus: e
    });
    const alert = this.alertCtrl.create({
      title: 'Ok',
      subTitle: 'Estatus modificado',
      buttons: ['OK']
    });
    alert.present();
    this.notificacion(e)
    this.navCtrl.setRoot(PedidosPage);
  }

  notificacion(mensaje){
    this.afDb.database.ref('users/'+this.user).once('value',data=>{
      let user = data.val();
      var notificationObj = { 
        app_id: "6b8e357e-3d6b-468a-a317-1ac1951994d5",
        include_player_ids: [user['userId']],
        data: {"foo": "bar"},
        headings: {"en": "El mandadito"},
        contents: {"en": 'Tu pedido esta '+ mensaje}
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

  ionViewDidLeave(){
    this.suscribir.unsubscribe();
  }

  prepareToPrint(){

    let receipt = '';
    receipt += '\x1b\x40'; // Clear data in buffer and reset modes
    receipt += '\x1b\x21\x00'; //Normal text
    receipt += '\x1b\x61\x01'; //left justification
    receipt += '*** ';
    receipt += 'EL MANDADITO';
    receipt += ' ***';
    receipt += '\n';

    receipt += '* ';
    receipt += '\x1b\x61\x01';
    receipt += 'CENTRAL DE ABASTOS, IRAPUATO';
    receipt += ' *';
    receipt += '\n';

    receipt += '*** ';
    receipt += '\x1b\x61\x01';
    receipt += 'ANDEN 4, LOCAL 17';
    receipt += ' ***';
    receipt += '\n';

    receipt += '*** ';
    receipt += '\x1b\x61\x01';
    receipt += 'TEL: (462)';
    receipt += ' ***';
    receipt += '\n';
    receipt += '\n';

    let hora = new Date();

    receipt += '\x1b\x61\x00';
    receipt += 'FECHA:'+hora.getDate()+'/'+hora.getMonth()+1+'/'+hora.getFullYear();
    receipt += '  HORA:'+hora.getHours()+':'+hora.getMinutes()+':'+hora.getSeconds();
    receipt += '\n';
    receipt += '\n';

    receipt += 'CLIENTE: '+this.direccion.usuario;
    receipt += '\n';
    receipt += 'CALLE: '+this.direccion.nomCalle;
    receipt += '\n';
    receipt += 'COLONIA: '+this.direccion.nomColonia;
    receipt += '\n';
    receipt += 'TELEFONO: '+this.direccion.telefono;
    receipt += '\n';
    receipt += 'CP: '+this.direccion.cp;
    receipt += '\n';
    if(!this.envioCond){
      receipt += 'RECOGER EN BODEGA';
      receipt += '\n';
    }
    receipt += '\x1b\x45\x01';
    receipt += 'CATEGORIA: '+this.direccion.categoria.toUpperCase();
    receipt += '\x1b\x45\x00';
    receipt += '\n';
    receipt += 'FOLIO: '+this.id;
    receipt += '\n';
    receipt += '\n';

    receipt += '\x1b\x61\x00';
    receipt += 'CANT.';
    receipt += '   ';
    receipt += 'DESC.';
    receipt += '     ';
    receipt += 'PREC.';
    receipt += ' '
    receipt += 'IMPO.';
    receipt += '\n';
    receipt += '================================';
    receipt += '\n';
    receipt += '\x1b\x44\x00';
    receipt += '\x1b\x44\x08\x12\x18\x00';

    this.productos.map(data=>{
      //Cantidad
      receipt += data['cantidad'];
      receipt += ' ';

      switch (data['unidadMed']) {
        case 'Kilogramos':
          receipt += 'KG\x09';
          break;
      
        case 'Manojo':
          receipt += 'MJ\x09';
          break;

        case 'Charola':
          receipt += 'CH\x09';
          break;
      
        case 'Domo':
          receipt += 'DO\x09';
          break;

        case 'Pieza':
        receipt += 'PZ\x09';
          break;
      }
      
      let nombreCort = '';
      let nombreArr = data['nombre'].split(" ");
      if( nombreArr.length > 1){
        for (let index = 0; index < 2; index++) {
          let nombCarac = nombreArr[index].slice(0,3);
          nombreCort = nombreCort.concat(" ", nombCarac);
        }
        receipt += nombreCort+'\x09';            
          
      }
      else{
        nombreCort = data['nombre'].slice(0,6);
        receipt += nombreCort+'\x09'; 
      }

      receipt += '$'+data['precioMen']+'\x09';
      let importe = data['precioMen'] * data['cantidad'];
      receipt += '$'+importe;
      receipt += '\n';

      if(data['sugerencia'] != ''){
        receipt += 'SUGE. '+data['sugerencia'];
        receipt += '\n';
        receipt += '\n';
      }

    });
    receipt += '================================';
    receipt += '\n';
    receipt += '\n';
    if(this.envioCond){
      receipt += 'GASTO DE ENVIO: $15';
      receipt += '\n';
    }
    receipt += '\x1b\x61\x00';
    receipt += 'IMPORTE TOTAL: $'+this.total;
    receipt += '\n';
    receipt += this.productos.length+' PRODUCTO(S)';
    receipt += '\n\n';
    receipt += '** ';
    receipt += '\x1b\x61\x01';
    receipt += 'AGRADECEMOS SU PREFERENCIA';
    receipt += ' **';
    receipt += '\n';
    receipt += '_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _';
    receipt += '\n\n';
  
    
    let alert = this.alertCtrl.create({
      title: 'Selecciona tu impresora',
      buttons: [{
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Selecciona impresora',
          handler: (device) => {
            if(!device){
              this.showToast('Selecciona una impresora');
              return false;
            }
            console.log(device);
            this.print(device, receipt);
          }
        }
      ]
    });

    this.bluetooth.enable().then(() =>{
      this.bluetooth.list().then( devices => {
        devices.forEach((devices) => {
          console.log('Devices: ', JSON.stringify(devices));
          alert.addInput({
            name: 'printer',
            value: devices.address,
            label: devices.name,
            type: 'radio'
          });
        });
        alert.present();
      }).catch((error) => {
        console.log(error);
        this.showToast('Hubo un error al conectarse con la impresora, Intente de nuevo.');
      });
    }).catch( error =>{
      console.log(error);
      this.showToast('Error al activar el Bluetooth, Intente de nuevo.');
    });
    
  }

  showToast(data) { 
    let toast = this.toastCtrl.create({
      duration: 3000,
      message: data,
      position: 'bottom'
    });
    toast.present();
  }

  print(device, ticket){
    console.log('Device mac: ', device);
    console.log('Data: ', ticket);
    let load = this.loadCtrl.create({
      content: 'Imprimiendo...',
    });
    load.present();
    this.bluetooth.connect(device).subscribe( status =>{
      console.log(status);
      this.bluetooth.write(this.noSpecialChars(ticket)).then( printStatus =>{
        let alert = this.alertCtrl.create({
          title: 'Impresion exitosa',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                load.dismiss();
                this.bluetooth.disconnect();
              }
            }
          ]
        });
        alert.present();
      }).catch( error =>{
        console.log(error);
          let alert = this.alertCtrl.create({
            title: 'Hubo un error al imprimir, Intente de nuevo',
            buttons: [
              {
                text: 'Ok',
                  handler: () => {
                  load.dismiss();
                  }
                }
              ]
            });
            alert.present();
          });
      },
      error=>{
        console.log(error);
        let alert = this.alertCtrl.create({
          title: 'Hubo un error al conectarse con la impresora, Intente de nuevo',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                load.dismiss();
              }
            }
          ]
        });
        alert.present();
      }
    );
      
  }

  noSpecialChars(string) {
    var translate = {
        à: 'a',
        á: 'a',
        â: 'a',
        ã: 'a',
        ä: 'a',
        å: 'a',
        æ: 'a',
        ç: 'c',
        è: 'e',
        é: 'e',
        ê: 'e',
        ë: 'e',
        ì: 'i',
        í: 'i',
        î: 'i',
        ï: 'i',
        ð: 'd',
        ñ: 'n',
        ò: 'o',
        ó: 'o',
        ô: 'o',
        õ: 'o',
        ö: 'o',
        ø: 'o',
        ù: 'u',
        ú: 'u',
        û: 'u',
        ü: 'u',
        ý: 'y',
        þ: 'b',
        ÿ: 'y',
        ŕ: 'r',
        À: 'A',
        Á: 'A',
        Â: 'A',
        Ã: 'A',
        Ä: 'A',
        Å: 'A',
        Æ: 'A',
        Ç: 'C',
        È: 'E',
        É: 'E',
        Ê: 'E',
        Ë: 'E',
        Ì: 'I',
        Í: 'I',
        Î: 'I',
        Ï: 'I',
        Ð: 'D',
        Ñ: 'N',
        Ò: 'O',
        Ó: 'O',
        Ô: 'O',
        Õ: 'O',
        Ö: 'O',
        Ø: 'O',
        Ù: 'U',
        Ú: 'U',
        Û: 'U',
        Ü: 'U',
        Ý: 'Y',
        Þ: 'B',
        Ÿ: 'Y',
        Ŕ: 'R',
      },
      translate_re = /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿŕŕÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÝÝÞŸŔŔ]/gim;
    return string.replace(translate_re, function(match) {
      return translate[match];
    });
  }
  
}
