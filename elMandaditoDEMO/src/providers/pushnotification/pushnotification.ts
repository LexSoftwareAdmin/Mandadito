import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal';


/*
  Generated class for the PushnotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PushnotificationProvider {

  constructor(private oneSignal: OneSignal) {
    console.log('Hello PushnotificationProvider Provider');
  }

  initOneSingal(){
    this.oneSignal.startInit('6b8e357e-3d6b-468a-a317-1ac1951994d5', '937762778096');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe(() => {
      console.log('Notificacion recibida')
    });

    this.oneSignal.handleNotificationOpened().subscribe(() => {
      console.log('Notificacion abierta')
    });

    this.oneSignal.endInit();
    }

    async obtenerId(){
      let claves = await this.oneSignal.getIds();
      return claves;
    }

}
