import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, Platform, ActionSheetController, AlertController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
declare function escape(s:string): string;

@Component({
  selector: 'page-alta-de-nuevo-producto',
  templateUrl: 'alta-de-nuevo-producto.html'
})
export class AltaDeNuevoProductoPage {

  nombrePro:string = "";
  categoPro:string = "";
  imagen:any = "../../assets/imgs/noImagen.jpg";
  foto:any ="";
  Uid : string;
  editar:any;
  camImg:boolean = false;
  keyImg:any; 
  titulo:string = "";
  editCond:boolean = false;
  precioMay= '';
  precioMen= '';
  unidadMed = '';
  descripcion = '';

  constructor(public platform: Platform,
              public actionsheetCtrl: ActionSheetController,
              public loadingCtrl: LoadingController, 
              private camara : Camera, 
              public navCtrl: NavController,
              public navParams: NavParams,
              private afDatabase: AngularFireDatabase,
              private afAuth:AngularFireAuth,
              private afStorage: AngularFireStorage,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController) {

    this.Uid = this.afAuth.auth.currentUser.uid;
    this.editar = this.navParams.get("key");

    if(this.editar != undefined){
      this.titulo = "Editar Producto";
      this.editCond = true;
      this.afDatabase.database.ref("productos/"+this.Uid+"/"+this.editar).once("value").then(data =>{
        let info = data.val();
        this.nombrePro = info.nombre;
        this.precioMay = info.precioMay;
        this.precioMen = info.precioMen;
        this.unidadMed = info.unidadMed;
        this.categoPro = info.categoPro;
        this.imagen = info.url;
        this.keyImg = info.horaRegistro;
        if(info.descripcion) this.descripcion = info.descripcion;
        else this.descripcion = '';

      });
    }
    else{
      this.titulo ="Agregar producto";

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
    let imagen = document.getElementById("producto");
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
      debugger;
      this.camImg = true;
      this.foto = foto; 
      this.imagen = 'data:image/jpg;base64,'+foto;
      foto = escape(foto);
      //imagen.setAttribute("src",'data:image/jpg;base64,'+foto);

    });

  }

  imgPreCam(){
    let imagen = document.getElementById("producto");
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
      this.camImg = true;
      this.foto = foto; 
      this.imagen = 'data:image/jpg;base64,'+foto;
      foto = escape(foto);
      //imagen.setAttribute("src",'data:image/jpg;base64,'+foto);

    });

  }

  guardarProducto(){
    let loader = this.loadingCtrl.create({
      content: "Guardando...",
      spinner: "crescent"
    });
    let hora = Date.now(); 
    loader.present();
    this.afStorage.ref('admin/'+this.Uid+'/productos/'+hora).putString(this.foto, 'base64', {contentType: 'image/jpg'}).then(fotoGuard =>{
    let snapFoto = fotoGuard.ref.getDownloadURL();
    snapFoto.then(data=>{
      this.afDatabase.database.ref("productos/"+this.Uid+'/'+hora).set({
        nombre: this.nombrePro,
        unidadMed: this.unidadMed,
        categoPro: this.categoPro,
        precioMen: this.precioMen,
        precioMay: this.precioMay,
        url: data,
        descripcion: this.descripcion,
        horaRegistro: hora,
      });
      loader.dismiss();
      this.navCtrl.pop();
    });

          
    });
  
  }

  editarProducto(){
    let loader = this.loadingCtrl.create({
      content: "Guardando...",
      spinner: "crescent"
    }); 
    loader.present();
    if(this.camImg){
      this.afStorage.ref('admin/'+this.Uid+'/productos/'+this.keyImg).putString(this.foto, 'base64', {contentType: 'image/jpg'}).then(fotoGuard =>{
        let snapFoto = fotoGuard.ref.getDownloadURL();
        snapFoto.then(data=>{
          this.afDatabase.database.ref("productos/"+this.Uid+"/"+this.editar).update({
            unidadMed: this.unidadMed,
            categoPro: this.categoPro,
            precioMen: this.precioMen,
            precioMay: this.precioMay,
            url: data,
            descripcion: this.descripcion
            });
        loader.dismiss();
        this.navCtrl.pop();
        });
      });
    }
    else{
      this.afDatabase.database.ref("productos/"+this.Uid+"/"+this.editar).update({
        nombre: this.nombrePro,
        categoPro: this.categoPro,
        unidadMed: this.unidadMed,
        precioMen: this.precioMen,
        precioMay: this.precioMay,
        descripcion: this.descripcion
      });
      loader.dismiss();
      this.navCtrl.pop();

    }
        
  }

  verificarCampos(guardar){    
    if( guardar ){
        if (this.nombrePro == '' || this.precioMay == '' || this.categoPro == '' || 
            this.unidadMed == '' || this.precioMen == '' || this.imagen=='../../assets/imgs/noImagen.jpg'
            || this.descripcion == ''){
  
              const error = this.alertCtrl.create({
                title: 'Error',
                message: 'Llene todos los campos.',
                buttons: ['OK']
              });
              error.present();
          }
  
          else{
            let signo = this.noSignos('nombre',false);
            signo = this.noSignos('descripcion',false);

            if(signo){
              this.guardarProducto();

            }
            else{
              const error = this.alertCtrl.create({
                title: 'Error',
                message: 'Revise los campos que no tengan caracteres especiales.',
                buttons: ['OK']
              });
              error.present();
            }
  
          }
  
      }
    else {
  
        if (this.nombrePro == '' || this.precioMay == '' || this.categoPro == '' 
            || this.precioMen == '' || this.unidadMed == '' || this.descripcion == '' ){
  
              const error = this.alertCtrl.create({
                title: 'Error',
                message: 'Llene todos los campos.',
                buttons: ['OK']
              });
              error.present();
          }
  
          else{
            let signo = this.noSignos('nombre',false);
            signo = this.noSignos('descripcion',false);

            if(signo){
              this.editarProducto();
            }
            else{
              const error = this.alertCtrl.create({
                title: 'Error',
                message: 'Revise los campos que no tengan caracteres especiales.',
                buttons: ['OK']
              });
              error.present();
            }
          }
      
    }
    
  
}

  ediCon(){
    const confirmacion = this.alertCtrl.create({
      title: '¿Esta seguro?',
      message: 'Se cambiara la informacion del producto de forma permanente.',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.verificarCampos(false);
          }
        }
      ]
    });
    confirmacion.present();

  }

  noSignos(campo, toas){
    if( campo == 'nombre') campo = this.nombrePro;
    else campo = this.descripcion;
    let expr = /^[a-zA-ZÀ-ÖØ-öø-ÿs0-9]+(\s[a-zA-ZÀ-ÖØ-öø-ÿs0-9]+)*$/;
    let cadena = expr.test(campo);
    if( !cadena && toas){
      const toast = this.toastCtrl.create({
        message: 'No se admiten caracteres especiales',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();

    }
    return cadena;
  }

  
}
