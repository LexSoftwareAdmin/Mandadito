import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';


@Component({
  selector: 'page-perfil-de-cliente',
  templateUrl: 'perfil-de-cliente.html'
})
export class PerfilDeClientePage {

  usuario = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private afDb: AngularFireDatabase) {

      let userId = this.navParams.get('key');
      this.afDb.object("users/"+userId).snapshotChanges().subscribe(data=>{
        this.usuario = {...data.payload.val()};
      });
  }
  
}
