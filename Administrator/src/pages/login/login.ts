import { Component } from '@angular/core';
import { NavController, AlertController, ToastController  } from 'ionic-angular';
import { InventarioPage } from '../inventario/inventario';
import { AltaDeNuevoProductoPage } from '../alta-de-nuevo-producto/alta-de-nuevo-producto';
import { EditarInformaciNDelProductoPage } from '../editar-informaci-ndel-producto/editar-informaci-ndel-producto';
import { TabsControllerPage } from "../tabs-controller/tabs-controller";
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  correo:string="";
  password:string="";

  constructor(private afAuth:AngularFireAuth, private afDb:AngularFireDatabase, public navCtrl: NavController, public alertCtrl : AlertController, public toastCtrl: ToastController) {
    /*this.afDb.database.ref("users").once("value").then(function(data){
      console.log(data.val());
    });*/
  }
  
  ingresar(){
    if(this.correo == "" || this.password == ""){
      let alert = this.alertCtrl.create({
        title: 'Campos vacios',
        subTitle: 'Llene todos los campos por favor.',
        buttons: ['Ok']
      });
      alert.present();

    }
    else{
      this.afAuth.auth.signInWithEmailAndPassword(this.correo,this.password).then((data)=>{

      }).catch((error)=>{
        this.presentAlert(error.code, error.message);
      });

    }
    
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

  ingEnt(e){
    if(e.keyCode == 13){
      this.ingresar();
    } 
  }

  goToInventario(params)
  {
    if (!params) params = {};
    this.navCtrl.push(TabsControllerPage);
  }
  
  //Función para ir a la pantalla de nuevo producto. 
  goToAltaDeNuevoProducto(params)
  {
    if (!params) params = {};
    this.navCtrl.push(AltaDeNuevoProductoPage);
  }
  
  //Función para ir a la pantalla de editar información del producto
  goToEditarInformaciNDelProducto(params){
    if (!params) params = {};
    this.navCtrl.push(EditarInformaciNDelProductoPage);
  }

  //Función para el login.
  login()
  {
    
  }
}
