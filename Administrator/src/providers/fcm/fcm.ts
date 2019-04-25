import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from 'angularfire2/database';

/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmProvider {

  constructor(private platform: Platform,
              public firebaseNative: Firebase,
              private afDb: AngularFireDatabase,
              private afAuth: AngularFireAuth) {
  }

  getToken() {

  let token;

  if (this.platform.is('android')) {
    this.firebaseNative.getToken().then(data=>{
      this.saveTokenToFirestore(data);
    });
  } 

  if (this.platform.is('ios')) {
    this.firebaseNative.getToken().then(data=>{
      this.saveTokenToFirestore(data);
    });
    this.firebaseNative.grantPermission().then(data=>{
      console.log(data);
    });
  }

  this.firebaseNative.onTokenRefresh().subscribe(data=>{
    console.log(data);
    this.saveTokenToFirestore(data);
  });
    
}


  saveTokenToFirestore(token) {
    let idUser = this.afAuth.auth.currentUser.uid;
    this.afDb.database.ref('admin/'+idUser).update({
      token
    });
  }

  // Listen to incoming FCM messages
  listenToNotifications() {}

}
