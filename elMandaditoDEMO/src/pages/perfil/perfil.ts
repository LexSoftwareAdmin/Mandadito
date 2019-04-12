import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, ActionSheetController, Platform, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from 'angularfire2/storage';
import { Camera } from '@ionic-native/camera';
declare function escape(s:string): string;

/**
 * Generated class for the PerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  usuario = {};
  otro:boolean = false;
  otroCFID:string;
  foto = "";
  userId:any;
  cambio:boolean = false;
  otroMet:boolean = false;
  otroMetodo:string;
  ciudades = [];


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private afAuth: AngularFireAuth, 
              private afDb: AngularFireDatabase,
              public alertCtrl: AlertController,
              public actionsheetCtrl: ActionSheetController,
              public platform: Platform ,
              private afStorage: AngularFireStorage,
              private camara:Camera,
              public loadingCtrl: LoadingController) {
        
    this.userId = this.afAuth.auth.currentUser.uid;
    this.afDb.object("users/"+this.userId).snapshotChanges().subscribe(data=>{
      this.usuario = {...data.payload.val()};
      if(this.usuario["usoCFID"] != "Por definir" && this.usuario["usoCFID"] != "Adquisición de mercancias" && 
        this.usuario["usoCFID"] != "Gastos en general" && this.usuario["usoCFID"] != ""){
          this.otroCFID = this.usuario["usoCFID"];
          this.usuario["usoCFID"] = '';
          this.otro = true;
        }
      if ( this.usuario['MetPago'] != 'Transferencia bancaria' || this.usuario['MetPago'] != 'Pago con cheque nominativo' ||
           this.usuario['MetPago'] != 'Pago en efectivo' && this.usuario['MetPago'] != ''){
                
            this.otroMetodo = this.usuario["MetPago"];
            this.usuario["MetPago"] = '';
            this.otroMet = true;

              }
    });
    this.afDb.list("admin").snapshotChanges().subscribe(data=>{
      this.ciudades = []
      this.ciudades = data.map(data=>{
        return data.payload.val()['nombre'];
      });
      console.log(this.ciudades);
    });
  }

  especificarCFID(e){
    if(e == "Otro"){
      this.otro = true;
    }
    else{
      this.otro = false;
    }
  }

  especificarMet(e){
    if(e == "Otro"){
      this.otroMet = true;
    }
    else{
      this.otroMet = false;
    }
  }

  imprimir(){

    if(this.otro){
      this.usuario['usoCFID'] = this.otroCFID;
    }

    if(this.otroMet){
      this.usuario['MetPago'] = this.otroMetodo;
    }
    let loading = this.loadingCtrl.create({
      content: 'Editando espere...'
    });
    
    loading.present();
    
    
    if(this.cambio ){
      this.afStorage.ref('users/perfil/'+this.userId).putString(this.foto, 'base64', {contentType: 'image/jpg'}).then(fotoGuard =>{
        let snapFoto = fotoGuard.ref.getDownloadURL();
        snapFoto.then(data=>{
          this.afDb.database.ref("users/"+this.userId).update({...this.usuario,url:data});
          loading.dismiss();
        });
          
      });
            
    }else{
      this.afDb.database.ref("users/"+this.userId).update({...this.usuario});
      loading.dismiss();

    }

    

  }

  validarCampos(){
    console.log(this.usuario);
    if (this.usuario['nomUsu'] == '' || this.usuario['correo'] == '' || this.usuario['categoria'] == '' || this.usuario['nomRem'] == '' || this.usuario['calleNum'] == '' ||
        this.usuario['colonia'] == '' || this.usuario['ciudad'] == '' || this.usuario['estado'] == '' ||
        this.usuario['telefono'] == '' || this.usuario['cp'] == '' || this.usuario['nom'] == ''
        || this.usuario['apMat'] == '' || this.usuario['apPat'] == '' ){

          const alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Llene todo los campos porfavor',
            buttons: ['OK']
          });
          alert.present();

        }
        else{

          this.imprimir();
          
        }
  }

  selecImagen(){
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Subir imagen',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Camara',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.imgPreCam();
            this.cambio = true;
          }
        },
        {
          text: 'Album',
          icon: !this.platform.is('ios') ? 'image' : null,
          handler: () => {
            this.imgPreAlb();
            this.cambio = true;
          }
        }
      ]
    });
    actionSheet.present();
    
  }

  imgPreAlb(){
    let imagen = document.getElementById("perfil");
    this.camara.getPicture({
      quality : 100,
      destinationType : this.camara.DestinationType.DATA_URL,
      sourceType : this.camara.PictureSourceType.PHOTOLIBRARY,
      allowEdit : true,
      encodingType: this.camara.EncodingType.JPEG,
      targetWidth: 320,
      targetHeight: 320,
      saveToPhotoAlbum: true
    }).then(foto=>{
      this.foto = foto; 
      foto = escape(foto);
      imagen.setAttribute("src",'data:image/jpg;base64,'+foto);

    });

  }

  imgPreCam(){
    let imagen = document.getElementById("perfil");
    this.camara.getPicture({
      quality : 100,
      destinationType : this.camara.DestinationType.DATA_URL,
      sourceType : this.camara.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType: this.camara.EncodingType.JPEG,
      targetWidth: 320,
      targetHeight: 320,
      saveToPhotoAlbum: true
    }).then(foto=>{
      this.foto = foto; 
      foto = escape(foto);
      imagen.setAttribute("src",'data:image/jpg;base64,'+foto);

    });

  }

}
