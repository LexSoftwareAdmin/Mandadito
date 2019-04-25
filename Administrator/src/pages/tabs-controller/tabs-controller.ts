import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PedidoPD01Page } from '../pedido-pd01/pedido-pd01';
import { PedidoPD05Page } from '../pedido-pd05/pedido-pd05';
import { UsuariosPage } from '../usuarios/usuarios';
import { PedidosPage } from '../pedidos/pedidos';
import { InventarioPage } from '../inventario/inventario';

import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'page-tabs-controller',
  templateUrl: 'tabs-controller.html'
})
export class TabsControllerPage {

  tab1Root: any = UsuariosPage;
  tab2Root: any = PedidosPage;
  tab3Root: any = InventarioPage;
  keyTien:any;
  badgeSurtiendo:any = 0;


  constructor(public navCtrl: NavController,
              private afDb: AngularFireDatabase,
              private afAuth : AngularFireAuth) {

    this.keyTien = this.afAuth.auth.currentUser.uid;
        this.afDb.list("pedidos/"+this.keyTien).snapshotChanges().subscribe(data=>{
          this.badgeSurtiendo = 0;
          let usuario = data.map(data=>({key: data.key}));
          usuario.map(data=>{
            let userKey = data.key;
            this.afDb.list("pedidos/"+this.keyTien+'/'+userKey).snapshotChanges().subscribe(data=>{
              data.map(data=>{
                let estado = data.payload.val()['estatus'];
                if(estado == 'Surtiendo'){
                  this.badgeSurtiendo += 1;
                }
              });
            });
          });
        });
        if(this.badgeSurtiendo == 0) this.badgeSurtiendo = '';
  }

}
