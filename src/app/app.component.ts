/* eslint-disable prefer-const */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable eqeqeq */
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { AuthService } from './auth/auth.service';
import { AnalyticsService } from './shared/analytics.service';
import { UserModel } from './shared/user.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  loggedIn = false;
  userId: any;

  constructor(private router: Router,
              private firestore: AngularFirestore,
              private authService: AuthService,
              private auth: AngularFireAuth,
              private alert: AlertController,
              private analytics: AnalyticsService,
              private menu: MenuController) {}

  ngOnInit() {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.analytics.setAnalUser(user.uid);
        this.loggedIn = true;
        const userDoc = this.firestore.collection('users').doc(user.uid);
        const userObs = userDoc.valueChanges();
        const userObs2 = userObs.subscribe((userInfoDoc: UserModel) => {
          this.authService.userInfo.next(userInfoDoc);
          this.userId = userInfoDoc.chefId;
          const userFavs = this.firestore.collection('users').doc(this.userId).collection('favorites');
          const favObs = userFavs.valueChanges();
          const favObs2 = favObs.subscribe(userFavsData => {
            const userFavsData2 = userFavsData;
            this.authService.userFavs.next(userFavsData2);
        });
          const userCookbooks = this.firestore.collection('users').doc(this.userId).collection('cookbooks');
          const cookbookObs = userCookbooks.valueChanges();
          const cookbookObs2 = cookbookObs.subscribe(cookbooks => {
            const userCookbooksData = cookbooks;
            this.authService.userCookbooks.next(userCookbooksData);
          });
          const userRecs = this.firestore.collection('users').doc(this.userId).collection('reccomendations');
          const recsObs = userRecs.valueChanges();
          const recsObs2 = recsObs.subscribe(reccomendations => {
            const userRecsData = reccomendations;
            this.authService.userReccomendations.next(userRecsData);
          });
          if (userInfoDoc.chefLevel == 'Chef') {
            this.firestore.collection('recipes', (ref) => ref
            .where('chefId', '==', this.userId)
            .orderBy('date', 'desc'))
            .snapshotChanges()
            .subscribe(recipes => {
              let loadedRecipes = [];
              recipes.forEach((doc) => {
                const docData: any = doc.payload.doc.data();
                docData.id = doc.payload.doc.id;
                loadedRecipes.push(docData);
              })
                this.authService.userRecipes.next(loadedRecipes);
              });
          }
      });
    }});
  }

  signUp() {
    this.router.navigate(['/auth', 'signup']);
    this.menu.close();
  }

  profile() {
    if (this.loggedIn == true) {
      this.router.navigate(['/profile', this.userId]);
    } else {
      this.alert.create({
        header: 'Free Account Required',
        message: 'Create a Free Account to Start Saving Recipes & Building Your Kitchen!',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              this.alert.dismiss();
            }
          },
          {
            text: 'Sign Up',
            handler: () => {
              this.router.navigate(['/auth', 'signup']);
              this.alert.dismiss();
            }
          }]
        }).then(alertEl => alertEl.present());
    }

    this.menu.close();
  }

  home() {
    this.router.navigate(['/home']);
    this.menu.close();
  }

  legal() {
    this.router.navigate(['/legal']);
    this.menu.close();
  }

  logout() {
    this.loggedIn = false;
    return this.auth.signOut().then(success => {
      this.authService.userInfo.next(null);
      this.authService.userCookbooks.next(null);
      this.authService.userFavs.next(null);
      this.authService.userRecipes.next(null);
      this.authService.userReccomendations.next(null);
      this.router.navigate(['/home']);
      this.menu.close();
    });
  }

  contact() {
    this.router.navigate(['/contact']);
    this.menu.close();
  }

  apply() {
    this.router.navigate(['/contact', 'apply']);
    this.menu.close();
  }

  logoClicked() {
    this.router.navigate(['/home']);
    this.menu.close();
  }

}
