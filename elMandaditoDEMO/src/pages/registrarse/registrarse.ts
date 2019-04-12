import { Component } from '@angular/core';
import { NavController, AlertController, ActionSheetController, Platform ,  LoadingController, ToastController } from 'ionic-angular';
import { IniciodeSesionPage } from '../iniciodesesion/iniciodesesion';
import { MisPreferenciasPage } from '../mispreferencias/mispreferencias';
import { TiendaPage } from '../tienda/tienda';
import { InformaciondelProductoPage } from '../informaciondelproducto/informaciondelproducto';
import { MiCarritoPage } from '../micarrito/micarrito';
import { ConfirmarDirecciondeEnvioPage } from '../confirmardirecciondeenvio/confirmardirecciondeenvio';
import { CarritoProvider } from '../../providers/carrito/carrito';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Camera } from '@ionic-native/camera';

declare function escape(s:string): string;



@Component({
  selector: 'pageregistrarse',
  templateUrl: 'registrarse.html'
})
export class RegistrarsePage {

  usuario={
    nomUsu: '',
    nom: '',
    apPat: '',
    apMat: '',
    correo: '',
    pass: '',
    nomRem: '',
    calleNum: '',
    colonia: '',
    ciudad: '',
    estado: '',
    telefono: '',
    cp: '',
    dirFis: '',
    nomFis: '',
    rfc: '',
    usoCFID: '',
    MetPago: '',
    opcion: '',
    categoria:'',
    url:'https://firebasestorage.googleapis.com/v0/b/aptito-71e75.appspot.com/o/users%2Fperfil%2Fgeneral.png?alt=media&token=feec8a44-bb1f-4e98-a8b0-4c1f1f8b641a',
    correoFis: ''
  }

  icono = "eye";
  passType = 'password';
  foto = "";
  otro:boolean = false;
  otroCFID:string;
  otroMet:boolean = false;
  otroMetodo:string;
  uid:any;
  loading:any;
  ciudades = [];


  constructor(public navCtrl: NavController,
              private afAuth: AngularFireAuth, 
              private afDb: AngularFireDatabase,
              public alertCtrl: AlertController,
              public actionsheetCtrl: ActionSheetController,
              public platform: Platform ,
              private afStorage: AngularFireStorage,
              private camara:Camera,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              public _carrito: CarritoProvider) {

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
      this.usuario.usoCFID = this.otroCFID;
    }

    if(this.otroMet){
      this.usuario.MetPago = this.otroMetodo;
    }

    this.loading = this.loadingCtrl.create({
      content: 'Guardando espere...'
    });
    
    this.loading.present();

    if( this.foto == '' ){
      this.afAuth.auth.createUserWithEmailAndPassword(this.usuario.correo, this.usuario.pass).then(data=>{
        this.uid = data.user.uid;
        this.afDb.database.ref("users/"+this.uid).set({...this.usuario});
      }).catch(error =>{
        this.loading.dismiss();
        console.log(error);
        this.presentAlert(error.code);
      });
            
    }else{
      this.afAuth.auth.createUserWithEmailAndPassword(this.usuario.correo, this.usuario.pass).then(data=>{
        this.uid = data.user.uid;
        this.afDb.database.ref("users/"+this.uid).set({...this.usuario,url: this.foto});

      }).catch(error =>{
        this.loading.dismiss();
        console.log(error);
        this.presentAlert(error.code);
      });

    }

    

  }
  cambiarIcono(){
    this.icono = this.icono == 'eye' ? 'eye-off' : 'eye';
    this.passType = this.passType == 'password' ? 'text' : 'password';

  }

  validarCampos(){

    for (const key in this.usuario) {
      let element = document.getElementsByClassName(key);
      if ( element[0] ){
        element[0].classList.remove("falta");
      }
      if(this.usuario[key] == ''){
       let elemento = document.getElementsByClassName(key);
       if ( elemento[0] ){
         elemento[0].classList.add("falta");
         console.log(elemento);
       }
      }
    }
    console.log(this.usuario);
    if (this.usuario.nomUsu == '' || this.usuario.correo == '' || this.usuario.pass == '' || 
        this.usuario.categoria == '' || this.usuario.nomRem == '' || this.usuario.calleNum == '' ||
        this.usuario.colonia == '' || this.usuario.ciudad == '' || this.usuario.estado == '' ||
        this.usuario.telefono == '' || this.usuario.cp == '' || this.usuario.nom == ''|| 
        this.usuario.apMat == '' || this.usuario.apPat == '' ){

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
          }
        },
        {
          text: 'Album',
          icon: !this.platform.is('ios') ? 'image' : null,
          handler: () => {
            this.imgPreAlb();
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

  presentAlert(codigo) {
    let toast = this.toastCtrl.create({
      message: 'El campo de email tiene que ser un texto valido, verifiquelo',
      position: 'bottom',
      duration: 2500,
      dismissOnPageChange: true
    });

    if(codigo == 'auth/invalid-email'){
      toast.present();
    }

    if(codigo == 'auth/weak-password'){
      toast = this.toastCtrl.create({
        message: 'La contraseña debe de ser de minimo 6 caracteres',
        position: 'bottom',
        duration: 2500,
        dismissOnPageChange: true
      });
      toast.present();
  
    }

    if (codigo == 'auth/email-already-in-use'){
      toast = this.toastCtrl.create({
        message: 'El correo ya esta en uso, verifiquelo',
        position: 'bottom',
        duration: 2500,
        dismissOnPageChange: true
      });
      toast.present();
    }

  
      
  
  
  }

  ionViewWillUnload(){
    if(this.foto != '' && this.loading != undefined){
      this.afStorage.ref('users/perfil/'+this.uid).putString(this.foto, 'base64', {contentType: 'image/jpg'}).then(fotoGuard =>{
        let snapFoto = fotoGuard.ref.getDownloadURL();
        snapFoto.then(data=>{
          this.afDb.database.ref("users/"+this.uid).update({url:data});
          this.guardarCarrito();
          this.loading.dismiss();
        });
          
      });

    }
    else {
      if( this.loading != undefined ){
        this.guardarCarrito();
        this.loading.dismiss();
        
      } 

    }
  }

  guardarCarrito(){
    let carrito = [];
    carrito = JSON.parse( localStorage.getItem('productos') );
    if( carrito ){
      carrito.map(data=>{
        if ( data['key'].match(/[a-z]/) ){
          this.afDb.database.ref("carrito/"+this.uid).push({
            nombre : data['nombre'], 
            categoPro : data['categoPro'],
            precioMen: parseFloat( data['precioMen'] ),
            unidadMed: data['unidadMed'],
            url: data['url'],
            cantidad : parseFloat( data['cantidad'] ),
            sugerencia: data [ 'sugerencia' ]
          });
        }
        else{
          this.afDb.database.ref("carrito/"+this.uid+'/'+data['key']).set({
            nombre : data['nombre'], 
            categoPro : data['categoPro'],
            precioMen: parseFloat( data['precioMen'] ),
            unidadMed: data['unidadMed'],
            url: data['url'],
            cantidad : parseFloat( data['cantidad'] ),
            sugerencia: data [ 'sugerencia' ]
          });
        }
      }); 
      localStorage.removeItem('productos');
      this._carrito.productos = [];
    }
  }
}
