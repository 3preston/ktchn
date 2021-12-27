/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable arrow-body-style */
/* eslint-disable guard-for-in */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-const */
/* eslint-disable no-var */
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, MenuController, ModalController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { CookbookSelectorComponent } from '../shared/cookbook-selector/cookbook-selector.component';
import { ProfileInfoComponent } from '../shared/profile-info/profile-info.component';
import { RecipeInfoComponent } from '../shared/recipe-info/recipe-info.component';
import { RecipeIngredientsComponent } from '../shared/recipe-ingredients/recipe-ingredients.component';
import { RecipeInstructionsComponent } from '../shared/recipe-instructions/recipe-instructions.component';
import { RecipeStoryComponent } from '../shared/recipe-story/recipe-story.component';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs/internal/Subscription';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AnalyticsService } from '../shared/analytics.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  segmentChosen = 'recipes';
  form: FormGroup;
  profileInfo: any;
  userFavs = [];
  userRecipes = [];
  userCookbooks = [];
  firstView = true;

  editMode = false;
  cookMode = false;
  pageLoaded = false;
  profileId: any;
  loggedIn = false;

  dataCollection: AngularFirestoreCollection<any>;
  data: any;
  dataSub: Subscription;


  constructor(private menu: MenuController,
              private modal: ModalController,
              private alert: AlertController,
              private authService: AuthService,
              private auth: AngularFireAuth,
              private firestore: AngularFirestore,
              private activatedRoute: ActivatedRoute,
              private storage: AngularFireStorage,
              private loading: LoadingController,
              private analytics: AnalyticsService,
              private router: Router) { }

  ngOnInit() {
    const routeObs = this.activatedRoute.paramMap.subscribe(paramMap => {
      this.profileId = paramMap.get('userId');
      this.auth.authState.subscribe(user => {
        // IF LOGGED IN
        if (user) {
          this.loggedIn = true;
          this.firestore.collection('users').doc(this.profileId).get().subscribe(profileInfo => {
            this.profileInfo = profileInfo.data();
            if (user.uid == this.profileId) {
              // get your own data //
              this.editMode = true;
              this.authService.userCookbooks.subscribe(cookbooks => {
                this.userCookbooks = cookbooks;
              });
              this.authService.userFavs.subscribe(userFavs => {
                this.userFavs = userFavs;
              });
              if (this.profileInfo.chefLevel == 'Cook') {
                this.cookMode = true;
                if (this.firstView === true) {
                  this.segmentChosen = 'favorites';
                  this.firstView = false;
                }
              } else {
                this.authService.userRecipes.subscribe(userRecipes => {
                  this.userRecipes = userRecipes;
                });
              }
              this.analytics.chefViewed(this.profileId, this.editMode);
            } else {
              // viewing another's profile, logged in
              if (this.profileInfo.chefLevel == 'Cook') {
                //if statement only relevant if viewing another's profile that isnt a chef, unlikely to occur
                this.cookMode = true;
                if (this.firstView === true) {
                  this.segmentChosen = 'favorites';
                }
              }
              const userRecipes = this.firestore.collection('recipes', (ref) => ref
              .where('chefId', '==', this.profileId)
              .orderBy('date', 'desc'));
              userRecipes.get().subscribe(recipes => {
                this.userRecipes = [];
                recipes.forEach((doc) => {
                  const docData: any = doc.data();
                  docData.id = doc.id;
                  this.userRecipes.push(docData);
                });
                this.firestore.collection('users').doc(this.profileId).collection('favorites').get()
                .subscribe(favorites => {
                  this.userFavs = [];
                  favorites.forEach((doc) => {
                    const docData: any = doc.data();
                    docData.id = doc.id;
                    this.userFavs.push(docData);
                  });
                });
                this.firestore.collection('users').doc(this.profileId).collection('cookbooks')
                .get().subscribe(cookbooks => {
                  this.userCookbooks = [];
                  cookbooks.forEach((doc) => {
                  const docData: any = doc.data();
                  this.userCookbooks.push(docData);
                  });
                });
              });
              this.analytics.chefViewed(this.profileId, this.editMode);
            }
          });
      } else {
        //not logged in, viewing another's profile
        const profileInfo2 = this.firestore.collection('users').doc(this.profileId).get()
        .subscribe(userInfo => {
          this.profileInfo = userInfo.data();
          if (this.profileInfo.chefLevel == 'Cook') {
            //if statement only relevant if viewing another's profile that isnt a chef, unlikely to occur
            this.cookMode = true;
            if (this.firstView === true) {
              this.segmentChosen = 'favorites';
            }
          }
          this.analytics.chefViewed(this.profileId, this.editMode);
        });
        const userRecipes = this.firestore.collection('recipes', (ref) => ref
        .where('chefId', '==', this.profileId)
        .orderBy('date', 'desc'));
        userRecipes.get().subscribe(recipes => {
          this.userRecipes = [];
          recipes.forEach((doc) => {
            const docData: any = doc.data();
            docData.id = doc.id;
            this.userRecipes.push(docData);
          });
          this.firestore.collection('users').doc(this.profileId).collection('favorites').get()
          .subscribe(favorites => {
            this.userFavs = [];
            favorites.forEach((doc) => {
              const docData: any = doc.data();
              docData.id = doc.id;
              this.userFavs.push(docData);
            });
          });
          this.firestore.collection('users').doc(this.profileId).collection('cookbooks')
          .get().subscribe(cookbooks => {
            this.userCookbooks = [];
            cookbooks.forEach((doc) => {
            const docData: any = doc.data();
            this.userCookbooks.push(docData);
            });
          });
        });
      };
      });
    });
  }

  segmentChange(chosenSegment: any) {
    this.segmentChosen = chosenSegment.detail.value;
    this.analytics.chefSegments(this.profileId, this.editMode);
  }

  openMenu() {
    this.menu.open();
  }

  routeAuth() {
    this.router.navigate(['/auth', 'sigup']);
  }

  enterCookBook(cookbook: any) {
    if (this.editMode) {
      this.router.navigate(['/cookbook', cookbook.cookbookName, this.profileInfo.chefId, 'edit']);
    } else {
      this.router.navigate(['/cookbook', cookbook.cookbookName, this.profileId]);
    }
  }

  createNewRecipe() {
    this.modal.create({component: RecipeInfoComponent, backdropDismiss: false}).then(modalEl => {
      modalEl.onDidDismiss().then(basicInfo => {
        if (basicInfo.data == undefined) {
          return;
        }
        this.modal.create({component: RecipeIngredientsComponent, backdropDismiss: false}).then(modalEl2 => {
          modalEl2.onDidDismiss().then(ingredientsInfo => {
            this.modal.create({component: RecipeInstructionsComponent, backdropDismiss: false}).then(modalEl3 => {
            modalEl3.onDidDismiss().then(instructionsInfo => {
              this.modal.create({component: RecipeStoryComponent, backdropDismiss: false}).then(modalEl4 => {
                modalEl4.onDidDismiss().then(storyInfo => {
                  this.loading.create({
                    keyboardClose: true,
                    message: 'Cooking Your Dish, Please Wait...'
                  }).then(loadingEl => {
                    loadingEl.present();
                    const mainPic = basicInfo.data.recipeData.mainPic;
                  const mainPicPath = basicInfo.data.recipeData.name + new Date();
                  const mainPicRef = this.storage.ref(mainPicPath);
                  const mainTask = mainPicRef.put(mainPic);
                  mainTask.snapshotChanges().pipe(finalize(() => {
                    mainPicRef.getDownloadURL().subscribe(mainURL => {
                      const mainPicURL = mainURL;

                      const storyPic = storyInfo.data.storyData.storyPic;
                      const storyPicPath = storyInfo.data.storyData.name + new Date();
                      const storyPicRef = this.storage.ref(storyPicPath);
                      const storyTask = storyPicRef.put(storyPic);
                      storyTask.snapshotChanges().pipe(finalize(() => {
                        storyPicRef.getDownloadURL().subscribe(storyURL => {
                          const storyPicURL = storyURL;

                          const instructions = instructionsInfo.data;
                          const ingredients = ingredientsInfo.data;
                          let recipeTypes = basicInfo.data.recipeData.recipeType;
                          if (recipeTypes == undefined) {
                            recipeTypes = [];
                          }

                          //write to firestore
                          this.firestore.collection('recipes').add({
                            name: basicInfo.data.recipeData.name,
                            description: basicInfo.data.recipeData.description,
                            hours: basicInfo.data.recipeData.hours,
                            minutes: basicInfo.data.recipeData.minutes,
                            recipeType: recipeTypes,
                            mainPic: mainPicURL,
                            instructions: instructions,
                            ingredients: ingredients,
                            story: storyInfo.data.storyData.story,
                            storyPic: storyPicURL,
                            chefName: this.profileInfo.chefName,
                            chefId: this.profileInfo.chefId,
                            date: new Date(),
                            reccomendations: 0
                          }).then((docRef) => {
                            loadingEl.dismiss();
                            this.router.navigate(['/details', docRef.id]);
                          });
                        });
                      })).subscribe();
                    });
                    }
                  )).subscribe();
                  });
                });
                modalEl4.present();
              });
            });
            modalEl3.present();
          });

        });
        modalEl2.present();
      });
      });
      modalEl.present();
    });
  }

  createNewCookbook() {
    let selectableRecipes = [];
    for (let recipe of this.userRecipes) {
      selectableRecipes.push(recipe);
    }
    for (let recipe of this.userFavs) {
      selectableRecipes.push(recipe);
    }
    this.modal.create({
      component: CookbookSelectorComponent,
      componentProps: {recipes: selectableRecipes},
      backdropDismiss: false
      }).then(modalEl => {
        modalEl.onDidDismiss().then(cookbookData => {
          if (cookbookData.data == undefined) {
            return;
          }
          this.loading.create({
            keyboardClose: true,
            message: 'Creating Your Cookbook, Please Wait...'
          }).then(alertEl => {
            alertEl.present();
            const recipes = cookbookData.data.cookbookData.recipes;
            const cookbookName = cookbookData.data.cookbookData.cookbookName;
            let includedRecipes = [];
            for (let recipe of recipes) {
              if (recipe.isChecked) {
                includedRecipes.push(recipe);
              }
            }
          //upload to storage, get URL, add to cookbookImage
          const cookbookPic = cookbookData.data.cookbookData.cookbookPic;
          const cookbookPicPath = cookbookName + new Date();
          const cookbookPicRef = this.storage.ref(cookbookPicPath);
          const cookbookTask = cookbookPicRef.put(cookbookPic);
          cookbookTask.snapshotChanges().pipe(finalize(() => {
            cookbookPicRef.getDownloadURL().subscribe(cookbookPicURL1 => {
              const cookbookPicUrl = cookbookPicURL1;
              for (let recipe of includedRecipes) {
                this.firestore.collection('users').doc(this.profileInfo.chefId).collection('cookbooks').doc(cookbookName)
                .collection('recipes').doc(recipe.id).set(recipe);
              }
              this.firestore.collection('users').doc(this.profileInfo.chefId).collection('cookbooks').doc(cookbookName)
              .set({
                cookbookName: cookbookName,
                cookbookLength: includedRecipes.length,
                cookbookPic: cookbookPicUrl
            }).then(() => {
              alertEl.dismiss();
              this.router.navigate(['/cookbook', cookbookName, this.profileInfo.chefId, 'edit']);
            });
            });
          })).subscribe();
          });
        });
      modalEl.present();
    });
  }

  updateInfo() {
    const shortenedName = this.profileInfo.chefName.split(': ');
    this.modal.create({
      component: ProfileInfoComponent,
      componentProps: {name: shortenedName[1], id: this.profileInfo.key, bio: this.profileInfo.chefBio},
      backdropDismiss: true
    }).then(modalEl => {
      modalEl.onDidDismiss().then(updatedInfo => {
        if (updatedInfo.data == undefined) {
          return;
        }
        const updatedName = updatedInfo.data.updatedInfo.name;
        const updatedBio = updatedInfo.data.updatedInfo.bio;
        this.profileInfo.chefName = 'Chef: ' + updatedName;
        this.profileInfo.chefBio = updatedBio;
        if (updatedName != null && updatedBio != null) {
          this.firestore.collection('users').doc(this.profileInfo.chefId).set({
            chefName: 'Chef: ' + updatedName,
            chefBio: updatedBio
          }, { merge: true });
        } else if (updatedName != null) {
          this.firestore.collection('users').doc(this.profileInfo.chefId).set({
            chefName: 'Chef: ' + updatedName,
          }, { merge: true });
        } else {
          this.firestore.collection('users').doc(this.profileInfo.chefId).set({
            chefBio: updatedBio
          }, { merge: true });
        }
     });
     modalEl.present();
    });
    this.analytics.chefInfoUpdated(this.profileId, 'info');
  }

  updatePic() {
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
      this.profileInfo.chefPic = image.dataUrl;

      const chefPic = image.dataUrl;
      const chefPicPath = this.profileInfo.chefName + new Date();
      const chefPicRef = this.storage.ref(chefPicPath);
      const chefTask = chefPicRef.putString(chefPic, 'data_url');
      chefTask.snapshotChanges().pipe(finalize(() => {
        chefPicRef.getDownloadURL().subscribe(downloadedUrl => {
        this.firestore.collection('users').doc(this.profileInfo.chefId).set({
          chefPic: downloadedUrl
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
    this.analytics.chefInfoUpdated(this.profileId, 'chefPic');
  }

  logoClicked() {
    this.router.navigate(['/home']);
  }

}
