import { Component } from '@angular/core';
import { NavController, AlertController, ToastController  } from 'ionic-angular';
import { MisPreferenciasPage } from '../mispreferencias/mispreferencias';
import { TiendaPage } from '../tienda/tienda';
import { InformaciondelProductoPage } from '../informaciondelproducto/informaciondelproducto';
import { MiCarritoPage } from '../micarrito/micarrito';
import { ConfirmarDirecciondeEnvioPage } from '../confirmardirecciondeenvio/confirmardirecciondeenvio';
import { EstatusPage } from '../estatus/estatus';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'pageiniciodesesion',
  templateUrl: 'iniciodesesion.html'
})
export class IniciodeSesionPage {

  correo:any ="";
  password:any ="";

  constructor(public navCtrl: NavController, private afAuth: AngularFireAuth,
    public alertCtrl : AlertController, public toastCtrl: ToastController) {
    
  }
  iniciar(){
    this.afAuth.auth.signInWithEmailAndPassword(this.correo, this.password).then(user=>{
      console.log(user);
    }).catch(error=>{
      this.presentAlert(error.code, error.message);
    });
  }

  presentAlert(codigo, mensaje) {
    let toast = this.toastCtrl.create({
      message: 'El campo de email tiene que ser un texto valido, verifiquelo',
      position: 'bottom',
      duration: 2500,
      dismissOnPageChange: true
    });
  
     if(codigo == "auth/user-not-found"){
    let alert = this.alertCtrl.create({
      title: 'El usuario no existe',
      subTitle: 'No hay registro de usuario correspondiente a este identificador. El usuario puede haber sido eliminado.',
      buttons: ['Ok']
    });
    alert.present();
  }
  
  if(codigo == "auth/wrong-password"){
    let alert = this.alertCtrl.create({
      title: 'Contraseña incorrecta',
      subTitle: 'La contraseña es invalida o el usuario no tiene contraseña.',
      buttons: ['Ok']
    });
    alert.present();
  }
  
  if(codigo == "auth/argument-error"){
    if(mensaje == 'signInWithEmailAndPassword failed: First argument "email" must be a valid string.'){
      toast.present();
      
  }
  else{
      toast = this.toastCtrl.create({
      message: 'El campo de contraseña tiene que ser un texto valido, verifiquelo',
      position: 'bottom',
      duration: 2500,
      dismissOnPageChange: true
    });
    toast.present();
  
  }
  }
  
  if(codigo == "auth/invalid-email"){
      toast = this.toastCtrl.create({
      message: 'El campo de email tiene un formato incorrecto',
      position: 'bottom',
      duration: 2500,
      dismissOnPageChange: true
    });
    toast.present();
  
  }
  
  
  }
}
