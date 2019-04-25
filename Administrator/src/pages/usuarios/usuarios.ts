import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PerfilDeClientePage } from '../perfil-de-cliente/perfil-de-cliente';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from 'angularfire2/database';


@Component({
  selector: 'page-usuarios',
  templateUrl: 'usuarios.html'
})
export class UsuariosPage {

  users = [];

  constructor(private afAuth: AngularFireAuth, private afDb: AngularFireDatabase, public navCtrl: NavController) {
    let userId = this.afAuth.auth.currentUser.uid;
    this.afDb.database.ref("admin/"+userId).once("value",data=>{
      let ciudad = data.val()['nombre'];
      this.afDb.list("users", ref=> ref.orderByChild('ciudad').equalTo(ciudad)).snapshotChanges().subscribe(data=>{
        this.users = data.map(data=>({key:data.key, ...data.payload.val()}));
        console.log(this.users);
      });
    });
    
  }
  goToPerfilDeCliente(key){
    console.log(key);
    this.navCtrl.push(PerfilDeClientePage,{key : key});
  }

  salir(){
    this.afAuth.auth.signOut();
  }
}
