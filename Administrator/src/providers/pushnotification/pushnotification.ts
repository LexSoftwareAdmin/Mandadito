import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal';

@Injectable()
export class PushnotificationProvider {

  constructor(private oneSignal: OneSignal) {
    console.log('Hello PushnotificationProvider Provider');
  }

  initOneSingal(){
    this.oneSignal.startInit('ed113f7f-9310-4b35-a774-332cbd72d05c', '937762778096');

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
