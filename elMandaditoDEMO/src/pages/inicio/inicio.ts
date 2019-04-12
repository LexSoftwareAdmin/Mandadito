import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { IniciodeSesionPage } from '../iniciodesesion/iniciodesesion';
import { MisPreferenciasPage } from '../mispreferencias/mispreferencias';
import { TiendaPage } from '../tienda/tienda';
import { InformaciondelProductoPage } from '../informaciondelproducto/informaciondelproducto';
import { MiCarritoPage } from '../micarrito/micarrito';
import { ConfirmarDirecciondeEnvioPage } from '../confirmardirecciondeenvio/confirmardirecciondeenvio';
import { EstatusPage } from '../estatus/estatus';
import { RegistrarsePage } from '../registrarse/registrarse';

import { CallNumber } from '@ionic-native/call-number';


@Component({
  selector: 'pageinicio',
  templateUrl: 'inicio.html'
})
export class InicioPage {

  constructor(public navCtrl: NavController, 
              private callNumber: CallNumber,
              public menuCtrl: MenuController) {

                this.menuCtrl.swipeEnable(false);
  }
  goToIniciodeSesion(params){
    if (!params) params = {};
    this.navCtrl.push(IniciodeSesionPage);
  }goToMisPreferencias(params){
    if (!params) params = {};
    this.navCtrl.push(MisPreferenciasPage);
  }goToTienda(params){
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
  }goToRegistrarse(params){
    if (!params) params = {};
    this.navCtrl.push(RegistrarsePage);
  }

  callJoint(telephoneNumber) {
    this.callNumber.callNumber(telephoneNumber, true);
  }
}
