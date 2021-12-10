/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AnalyticsService } from '../shared/analytics.service';
import { RecipeInfoComponent } from '../shared/recipe-info/recipe-info.component';
import { RecipeIngredientsComponent } from '../shared/recipe-ingredients/recipe-ingredients.component';
import { RecipeInstructionsComponent } from '../shared/recipe-instructions/recipe-instructions.component';
import { RecipeStoryComponent } from '../shared/recipe-story/recipe-story.component';
import { RecipeModel } from '../shared/recipe.model';
import { UserModel } from '../shared/user.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent implements OnInit {

  @Output() imagePick = new EventEmitter<string | File>();
  @Input() selectedImage: string;
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  usePicker = false;

  chosenSegment = 'ingredients';
  favorite = false;
  newMode = false;
  editMode = false;
  isLoading = false;
  userInfo: UserModel;
  chefName: any;
  chefPic: any;

  instructions = [];
  ingredients = [];
  story: any;

  recipe: RecipeModel;
  recipeId: string;
  userFavs: any;

  downloadURL: Observable<string>;

  recipeObs: Subscription;
  chefObs: Subscription;
  userFavObs: Subscription;
  userRecObs: Subscription;
  userInfoObs: Subscription;
  reccomended = false;

  constructor(private navCntrl: NavController,
              private alert: AlertController,
              private authService: AuthService,
              private firestore: AngularFirestore,
              private storage: AngularFireStorage,
              private router: Router,
              private modal: ModalController,
              private analytics: AnalyticsService,
              private functions: AngularFireFunctions,
              private activatedRoute: ActivatedRoute) { }


  ngOnInit() {
    const routeObs = this.activatedRoute.paramMap.subscribe(paramMap => {
      this.recipeId = paramMap.get('recipeId');
      this.recipeObs = this.firestore.collection('recipes').doc(this.recipeId).get().subscribe(recipe => {
        this.recipe = recipe.data();
        this.chefObs = this.firestore.collection('users').doc(this.recipe.chefId).get().subscribe((chefInfo: any) => {
          const docData = chefInfo.data()
          this.chefName = docData.chefName;
          this.chefPic = docData.chefPic;
        })
        this.userInfoObs = this.authService.userInfo.subscribe(userInfo => {
          this.userInfo = userInfo;
          try {
            if (this.userInfo.chefId == this.recipe.chefId) {
              this.editMode = true;
            }
          } catch {
            this.editMode = false;
          }
          if (this.editMode == false) {
            this.userFavObs = this.authService.userFavs.subscribe(userFavs => {
              if (userFavs != null) {
                for (const fav of userFavs) {
                  if (fav.id == this.recipeId) {
                    this.favorite = true;
                  }
                }
              }
            });
            this.userRecObs = this.authService.userReccomendations.subscribe(userRecs => {
              if (userRecs != null) {
                for (const rec of userRecs) {
                  if (rec.reccomendation == this.recipeId) {
                    this.reccomended = true;
                  }
                }
              }
            });
          }
        });
        this.analytics.viewRecipeDetails(this.recipeId, this.editMode);
      });
    });
  }

  goBack() {
    this.navCntrl.pop();
  }

  logoClicked() {
    this.router.navigate(['/home']);
  }

  segmentChange(chosenSegment: any) {
    this.chosenSegment = chosenSegment.detail.value;
    this.analytics.recipeDetailsSegment(this.recipeId, this.chosenSegment, this.editMode);
  }

  favorited() {
    if (this.userInfo == null) {
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
    } else {
      this.favorite = !this.favorite;
      if (this.favorite === true) {
        this.firestore.collection('users').doc(this.userInfo.chefId).collection('favorites').doc(this.recipeId).set({
          name: this.recipe.name,
          mainPic: this.recipe.mainPic,
          minutes: this.recipe.minutes,
          description: this.recipe.description,
          id: this.recipeId
        }, {merge: true });
        this.alert.create({
          header: 'Favorited',
          message: 'See Profile For Favorites',
          buttons: ['Okay']
        }).then(alertEl => alertEl.present());
      } else {
        this.firestore.collection('users').doc(this.userInfo.chefId).collection('favorites').doc(this.recipeId).delete();
        this.alert.create({
          header: 'Removed Favorite',
          buttons: ['Okay']
        }).then(alertEl => alertEl.present());
      }
    }
  }

  editInfo() {
    this.modal.create({
      component: RecipeInfoComponent,
      componentProps: {name: this.recipe.name, minutes: this.recipe.minutes, description: this.recipe.description, category: this.recipe.recipeType, mode: 'edit'}
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        this.recipe.name = modalData.data.recipeData.name;
        this.recipe.description = modalData.data.recipeData.description;
        this.recipe.minutes = modalData.data.recipeData.minutes;
        this.recipe.recipeType = modalData.data.recipeData.recipeType;
        this.firestore.collection('recipes').doc(this.recipeId).set({
          name: modalData.data.recipeData.name,
          description: modalData.data.recipeData.description,
          minutes: modalData.data.recipeData.minutes,
          recipeType: modalData.data.recipeData.recipeType
        }, { merge: true });
      });
      modalEl.present();
    });
    this.analytics.recipeDetailsEdited(this.recipeId, 'info');
  }

  editInstructions() {
    this.modal.create({
      component: RecipeInstructionsComponent,
      componentProps: {instructions: this.recipe.instructions}
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        const updatedInstructions = modalData.data;
        this.firestore.collection('recipes').doc(this.recipeId).set({
          instructions: updatedInstructions
        }, { merge: true });
      });
      modalEl.present();
    });
    this.analytics.recipeDetailsEdited(this.recipeId, 'instructions');
  }

  editIngredients() {
    this.modal.create({
      component: RecipeIngredientsComponent,
      componentProps: {ingredients: this.recipe.ingredients}
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        const updatedIngredients = modalData.data;
        this.firestore.collection('recipes').doc(this.recipeId).set({
          ingredients: updatedIngredients
        }, { merge: true });
      });
      modalEl.present();
    });
    this.analytics.recipeDetailsEdited(this.recipeId, 'ingredients');
  }

  editStory() {
    this.modal.create({
      component: RecipeStoryComponent,
      componentProps: {story: this.recipe.story, mode: 'storyEdit'}
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        const updatedStory = modalData.data.storyData.story;
        this.recipe.story = updatedStory;
        this.firestore.collection('recipes').doc(this.recipeId).set({
          story: updatedStory
        }, { merge: true });
      });
      modalEl.present();
    });
    this.analytics.recipeDetailsEdited(this.recipeId, 'story');
  }

  editStoryPic() {
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
      this.isLoading = true;
      this.recipe.storyPic = image.dataUrl;
      this.isLoading = false;

      const storyPic = image.dataUrl;
      const storyPicPath = this.recipe.name + new Date();
      const storyPicRef = this.storage.ref(storyPicPath);
      const storyPicTask = storyPicRef.putString(storyPic, 'data_url');
      storyPicTask.snapshotChanges().pipe(finalize(() => {
        storyPicRef.getDownloadURL().subscribe(downloadedUrl => {
        this.firestore.collection('recipes').doc(this.recipeId).set({
          storyPic: downloadedUrl
        }, {merge: true });
        });
      })).subscribe();
    }).catch(error => {
      this.alert.create({
        header: 'Camera Error',
        message: error,
      }).then((alertEl) => {
        alertEl.present();
        return;
      });
    });
    this.analytics.recipeDetailsEdited(this.recipeId, 'storyPic');
  }

  updatePicture() {
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
      this.isLoading = true;
      this.recipe.mainPic = image.dataUrl;
      this.isLoading = false;

      const mainPic = image.dataUrl;
      const mainPicPath = this.recipe.name + new Date();
      const mainPicRef = this.storage.ref(mainPicPath);
      const mainTask = mainPicRef.putString(mainPic, 'data_url');
      mainTask.snapshotChanges().pipe(finalize(() => {
        mainPicRef.getDownloadURL().subscribe(downloadedUrl => {
        this.firestore.collection('recipes').doc(this.recipeId).set({
          mainPic: downloadedUrl
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
    });
    this.analytics.recipeDetailsEdited(this.recipeId, 'recipePic');
  }

  goToChef() {
    this.router.navigate(['/profile', this.recipe.chefId]);
  }

  deleteRecipe() {
    this.alert.create({
      header: 'ARE YOU SURE?',
      message: 'THIS WILL PERMANENTLY DELETE YOUR RECIPE',
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
            this.router.navigate(['/home']);
            this.firestore.collection('recipes').doc(this.recipeId).delete();
            this.alert.dismiss();
            this.analytics.recipeDeleted(this.recipeId);
          }
        }]
      }).then(alertEl => alertEl.present());
  }

  reccomend() {
    if (this.userInfo == null) {
      this.alert.create({
        header: 'Free Account Required',
        message: 'Create a Free Account to Start Reccomending Recipes & Building Your Kitchen!',
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
    } else {
      this.reccomended = true;
      this.recipe.reccomendations = +this.recipe.reccomendations + 1;
      const callable = this.functions.httpsCallable('recipeReccomended')
      const returnData = callable({
        recipeId: this.recipeId,
        updatedScore: this.recipe.reccomendations
      }).subscribe();
      this.firestore.collection('users').doc(this.userInfo.chefId)
      .collection('reccomendations').doc(this.recipeId).set({
        reccomendation: this.recipeId
      });
    }
  }

  ionViewDidLeave() {
    this.recipeObs.unsubscribe();
    this.chefObs.unsubscribe();
    this.userFavObs.unsubscribe();
    this.userInfoObs.unsubscribe();
    this.userRecObs.unsubscribe();
  }

}
