import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
declare var google;


/**
 * Generated class for the NosotrosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nosotros',
  templateUrl: 'nosotros.html',
})
export class NosotrosPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private callNumber: CallNumber) {
  }

  ionViewDidLoad() {
   this.loadmap2();
  }

  llamar(){
    this.callNumber.callNumber('524622522191', true);
  }


  loadmap2(){
    const $mapa = document.getElementById("mapa");
    const mapa = new google.maps.Map($mapa,{
      center: {
        lat: 20.651304,
        lng: -101.353391
      },
      zoom: 18,

      });

      var image = "../../assets/img/icon.png";

      const marker = new google.maps.Marker({
        position: {
          lat: 20.651304,
          lng: -101.353391
        },
        map: mapa,
        title: 'El mandadito',
        icon: image,
        animation: google.maps.Animation.DROP
      });

      console.log(marker);

    }

}
