/* eslint-disable max-len */
/* eslint-disable object-shorthand */
/* eslint-disable no-var */
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AnalyticsService } from '../shared/analytics.service';
import { UserModel } from '../shared/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userInfo = new BehaviorSubject<UserModel>(null);
  userFavs = new BehaviorSubject<any>(null);
  userCookbooks = new BehaviorSubject<any>(null);
  userRecipes = new BehaviorSubject<any>(null);
  userReccomendations = new BehaviorSubject<any>(null);

  constructor(private auth: AngularFireAuth,
              private firestore: AngularFirestore,
              private analytics: AnalyticsService,
              private navCntrl: NavController,
              private router: Router,
              private alertCntrl: AlertController) { }


  authenticate(email: string, password: string, modeLogin?: boolean, name?: string) {
    if (modeLogin) {
        this.auth.signInWithEmailAndPassword(email, password)
        .then((userInfo) => {
          this.analytics.setAnalUser(userInfo.user.uid);
          const userDoc = this.firestore.collection('users').doc(userInfo.user.uid);
          const userDocObs = userDoc.valueChanges();
          userDocObs.subscribe((userInfoDoc: UserModel) => {
            this.userInfo.next(userInfoDoc);
            this.navCntrl.pop();
            // this.router.navigate(['/profile', this.userInfo.value.chefId]);
          });
        }).catch((error) => {
          const message = error.message;
          this.alertCntrl.create({
            header: 'Login Error',
            message: message,
            buttons: ['Okay']
          }).then(alertEl => alertEl.present());
        });
      } else {
        this.auth.createUserWithEmailAndPassword(email, password)
          .then((userInfo) => {
            const key = userInfo.user.uid;
            var tempData: UserModel = {
              email: userInfo.user.email,
              chefId: userInfo.user.uid,
              chefName: 'Chef: ' + name,
              chefLevel: 'Chef',
              chefPic: 'https://firebasestorage.googleapis.com/v0/b/ktchn-7be34.appspot.com/o/chefSmall.jpg?alt=media&token=8b89d42f-31cd-41a4-a2a5-ff8dde48d70e'
            };
            this.firestore.collection('users').doc(key).set(tempData);
            this.userInfo.next(tempData);
            this.router.navigate(['/profile', this.userInfo.value.chefId]);
            this.analytics.setAnalUser(userInfo.user.uid);
          }).catch((error => {
            const message = error.message;
            this.alertCntrl.create({
              header: 'Sign Up Error',
              message: message,
              buttons: ['Okay']
            }).then(alertEl => alertEl.present());
          }));
      }
  }


}
