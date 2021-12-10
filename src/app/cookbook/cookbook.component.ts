/* eslint-disable object-shorthand */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable no-cond-assign */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { CookbookSelectorComponent } from '../shared/cookbook-selector/cookbook-selector.component';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AnalyticsService } from '../shared/analytics.service';

@Component({
  selector: 'app-cookbook',
  templateUrl: './cookbook.component.html',
  styleUrls: ['./cookbook.component.scss'],
})
export class CookbookComponent implements OnInit {

  editMode = false;
  cookbookName: any;
  chefId: any;
  cookbookRecipes: any = [];
  userFavorites: any;
  cookbookPic: any;

  routeObs: Subscription;
  cookbookObs: Subscription;
  recipeObs: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private modal: ModalController,
              private storage: AngularFireStorage,
              private authService: AuthService,
              private navCntrl: NavController,
              private alert: AlertController,
              private router: Router,
              private analytics: AnalyticsService,
              private firestore: AngularFirestore) { }

  ngOnInit() {
    this.routeObs = this.activatedRoute.paramMap.subscribe(paramMap => {
      if (paramMap.has('edit')) {
        this.editMode = true;
      }
      this.cookbookName = paramMap.get('cookbookId');
      this.chefId = paramMap.get('chefId');
      if (this.cookbookRecipes.length < 1) {
        this.recipeObs = this.firestore.collection('users').doc(this.chefId).collection('cookbooks')
        .doc(this.cookbookName).collection('recipes').get().subscribe(recipes => {
          recipes.forEach((doc) => {
            const docData: any = doc.data();
            docData.id = doc.id;
            this.cookbookRecipes.push(docData);
          });
          //get cookbookPic
          this.cookbookObs = this.firestore.collection('users').doc(this.chefId).collection('cookbooks').doc(this.cookbookName).get().subscribe(docData => {
            this.cookbookPic = docData.data().cookbookPic;
          });
        });
      }
    });
    this.analytics.cookbookViewed(this.cookbookName, this.chefId, this.editMode);
  }

  editCookbook() {
    let selectableRecipes = [];
    for (const recipe of this.cookbookRecipes) {
      recipe.isChecked = true;
      selectableRecipes.push(recipe);
    }
    const favSub = this.authService.userFavs.subscribe(userFavs => {
      this.userFavorites = userFavs;
      for (const favorite of this.userFavorites) {
        if (selectableRecipes.some(recipe => recipe.id == favorite.id)) {
        } else {
          favorite.isChecked = false;
          selectableRecipes.push(favorite);
        }
      }
      const recipeSub = this.authService.userInfo.subscribe(userInfo => {
        if (userInfo.chefLevel == 'Chef') {
          const recipeSub2 = this.authService.userRecipes.subscribe(recipes => {
            for (const recipe of recipes) {
              if (selectableRecipes.some(rec => rec.id == recipe.id)) {
              } else {
                recipe.isChecked = false;
                selectableRecipes.push(recipe);
              }
            }
            this.modal.create({
              component: CookbookSelectorComponent,
              componentProps: {recipes: selectableRecipes, editMode: true}}).then(modalEl => {
                modalEl.onDidDismiss().then(recipesChecked => {
                  favSub.unsubscribe();
                  recipeSub.unsubscribe();
                  recipeSub2.unsubscribe();
                  if (recipesChecked.data == undefined) {
                    return;
                  }
                  const recipes2 = recipesChecked.data.cookbookData.recipes;
                  let includedRecipes = [];
                  for (let recipe of recipes2) {
                    if (recipe.isChecked) {
                      includedRecipes.push(recipe);
                    }
                  }
                  for (const recipe of this.cookbookRecipes) {
                    this.firestore.collection('users').doc(this.chefId).collection('cookbooks').doc(this.cookbookName).collection('recipes').doc(recipe.id).delete();
                  }
                  this.firestore.collection('users').doc(this.chefId).collection('cookbooks').doc(this.cookbookName).delete().then(() => {
                    this.firestore.collection('users').doc(this.chefId).collection('cookbooks').doc(this.cookbookName)
                    .set({
                      cookbookName: this.cookbookName,
                      cookbookLength: includedRecipes.length,
                      cookbookPic: this.cookbookPic
                    }).then(() => {
                      for (let recipe of includedRecipes) {
                        this.firestore.collection('users').doc(this.chefId).collection('cookbooks').doc(this.cookbookName)
                        .collection('recipes').doc(recipe.id).set(recipe);
                      }
                      this.cookbookRecipes = includedRecipes;
                    });
                  });
                });
                modalEl.present();
              });
          });
        } else {
          this.modal.create({
            component: CookbookSelectorComponent,
            componentProps: {recipes: selectableRecipes, editMode: true}}).then(modalEl => {
              modalEl.onDidDismiss().then(recipesChecked => {
                favSub.unsubscribe();
                recipeSub.unsubscribe();
                if (recipesChecked.data == undefined) {
                  return;
                }
                const recipes = recipesChecked.data.cookbookData.recipes;
                let includedRecipes = [];
                for (let recipe of recipes) {
                  if (recipe.isChecked) {
                    includedRecipes.push(recipe);
                  }
                }
                for (const recipe of this.cookbookRecipes) {
                  this.firestore.collection('users').doc(this.chefId).collection('cookbooks').doc(this.cookbookName).collection('recipes').doc(recipe.id).delete();
                }
                this.firestore.collection('users').doc(this.chefId).collection('cookbooks').doc(this.cookbookName).delete().then(() => {
                  this.firestore.collection('users').doc(this.chefId).collection('cookbooks').doc(this.cookbookName)
                  .set({
                    cookbookName: this.cookbookName,
                    cookbookLength: includedRecipes.length,
                    cookbookPic: this.cookbookPic
                  }).then(() => {
                    for (let recipe of includedRecipes) {
                      this.firestore.collection('users').doc(this.chefId).collection('cookbooks').doc(this.cookbookName)
                      .collection('recipes').doc(recipe.id).set(recipe);
                    }
                    this.cookbookRecipes = includedRecipes;
                  });
                });
              });
              modalEl.present();
            });
        }
      });
    });
    this.analytics.cookbookEdited(this.cookbookName, this.chefId);
  }

  deleteCookbook() {
    this.alert.create({
      header: 'ARE YOU SURE?',
      message: 'THIS WILL PERMANENTLY DELETE YOUR COOKBOOK',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            this.alert.dismiss();
          }
        },
        {
          text: 'DELETE',
          handler: () => {
            this.navCntrl.pop();
            for (const recipe of this.cookbookRecipes) {
              this.firestore.collection('users').doc(this.chefId).collection('cookbooks').doc(this.cookbookName).collection('recipes').doc(recipe.id).delete();
            }
            this.firestore.collection('users').doc(this.chefId).collection('cookbooks').doc(this.cookbookName).delete();
            this.alert.dismiss();
            this.analytics.cookbookDeleted(this.cookbookName, this.chefId);
          }
        }]
      }).then(alertEl => alertEl.present());
  }

  ionViewDidLeave() {
    this.routeObs.unsubscribe();
    this.cookbookObs.unsubscribe();
    this.recipeObs.unsubscribe();
  }

  editCookbookPic() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.alert.create({
        header: 'Camera Error',
        message: 'Please Try Again'
      }).then((alertEl) => {
        alertEl.present();
        return;
      });
    }
    Camera.getPhoto({
      quality: 100,
      source: CameraSource.Photos,
      correctOrientation: true,
      height: 200,
      width: 350,
      resultType: CameraResultType.DataUrl
    }).then(image => {
      this.cookbookPic = image.dataUrl;
      const updatedPicUrl = image.dataUrl;
      const updatedPicPath = this.cookbookName + new Date();
      const updatedPicRef = this.storage.ref(updatedPicPath);
      const updatedTask = updatedPicRef.putString(updatedPicUrl, 'data_url');
      updatedTask.snapshotChanges().pipe(finalize(() => {
        updatedPicRef.getDownloadURL().subscribe(downloadedUrl => {
        this.firestore.collection('users').doc(this.chefId).collection('cookbooks').doc(this.cookbookName).set({
          cookbookPic: downloadedUrl
        }, {merge: true });
        });
      })).subscribe();
    }).catch(error => {
      this.alert.create({
        header: 'Camera Error',
        message: error
      }).then((alertEl) => {
        alertEl.present();
        return;
      });
      console.log(error);
    });
  }

  logoClicked() {
    this.router.navigate(['/home']);
  }


}
