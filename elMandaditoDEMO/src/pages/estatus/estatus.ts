import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TiendaPage } from '../tienda/tienda';
import { InformaciondelProductoPage } from '../informaciondelproducto/informaciondelproducto';
import { MiCarritoPage } from '../micarrito/micarrito';
import { ConfirmarDirecciondeEnvioPage } from '../confirmardirecciondeenvio/confirmardirecciondeenvio';

@Component({
  selector: 'page-estatus',
  templateUrl: 'estatus.html'
})
export class EstatusPage {

  constructor(public navCtrl: NavController) {
  }
  goToTienda(params){
    if (!params) params = {};
    this.navCtrl.push(TiendaPage);
  }goToInformaciondelProducto(params){
    if (!params) params = {};
    this.navCtrl.push(InformaciondelProductoPage);
  }goToMiCarrito(params){
    if (!params) params = {};
    this.navCtrl.push(MiCarritoPage);
  }goToConfirmarDirecciondeEnvio(params){
    if (!params) params = {};
    this.navCtrl.push(ConfirmarDirecciondeEnvioPage);
  }goToEstatus(params){
    if (!params) params = {};
    this.navCtrl.push(EstatusPage);
  }
}
