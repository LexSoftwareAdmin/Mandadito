import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { PedidoPD01Page } from '../pedido-pd01/pedido-pd01';
import { PedidoPD05Page } from '../pedido-pd05/pedido-pd05';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'page-pedidos',
  templateUrl: 'pedidos.html'
})
export class PedidosPage {

  pedidos = [];
  keyTien:any;
  estado = "todos";
  entregados= [];
  noEntregados = [];

  constructor(public navCtrl: NavController, private afDb: AngularFireDatabase,
    private afAuth : AngularFireAuth,
    private alertCtrl: AlertController) {
      this.keyTien = this.afAuth.auth.currentUser.uid;
        this.afDb.list("pedidos/"+this.keyTien).snapshotChanges().subscribe(data=>{
          this.pedidos = [];
          this.entregados = [];
          this.noEntregados = [];
          let usuario = data.map(data=>({key: data.key}));
          usuario.map(data=>{
            let userKey = data.key;
            this.afDb.list("pedidos/"+this.keyTien+'/'+userKey).snapshotChanges().subscribe(data=>{
              data.map(data=>{
                let estado = data.payload.val()['estatus'];
                let color;
                switch (estado) {
                  case 'Surtiendo':
                    color = 'verde'
                    break;
                
                  case 'En ruta':
                    color = 'amarillo'
                    break;
                  
                  case 'Entregado':
                    color = 'rojo'
                    break;
                }
                if(estado == 'Entregado'){
                  this.entregados.push({key: data.key, user: userKey, estado: estado, color:color});
                }
                else{
                  this.noEntregados.push({key: data.key, user: userKey, estado: estado, color:color});
                }
                this.pedidos.push({key: data.key, user: userKey, estado: estado, color:color});
              });
            });
          });
        });

  }

  infoPedido(id, user){
    this.navCtrl.push(PedidoPD01Page,{id:id, user:user});
  }
  goToPedidoPD01(params){
    if (!params) params = {};
    this.navCtrl.push(PedidoPD01Page);
  }goToPedidoPD05(params){
    if (!params) params = {};
    this.navCtrl.push(PedidoPD05Page);
  }
  eliminar(key, user){
    let alert = this.alertCtrl.create({
      title: 'Eliminar pedido',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.afDb.database.ref('pedidos/'+this.keyTien+'/'+user+'/'+key).once('value',(data)=>{
              let objeto = data.val();
              this.afDb.database.ref('eliminados/'+this.keyTien+'/'+user+'/'+key).push({objeto});
              this.afDb.database.ref('pedidos/'+this.keyTien+'/'+user+'/'+key).remove();
            });
          }
        }
      ]
    });
    alert.present();

  }
}
