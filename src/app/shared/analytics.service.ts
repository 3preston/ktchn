/* eslint-disable object-shorthand */
/* eslint-disable eqeqeq */
import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { Device } from '@capacitor/device';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  loggedIn = false;

  constructor(private auth: AngularFireAuth) {
    this.initFB();
    this.setLoggedIn();
  }

  initFB() {
    //posisble this setup could create issues with native apps
    //removed Device check due to firebase initialization error that was coming up...
    // Device.getInfo().then(platform => {
    //   console.log(platform);
    // });
    FirebaseAnalytics.initializeFirebase(environment.firebaseConfig);
  }

  setLoggedIn() {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
  }


  setAnalUser(uId) {
    FirebaseAnalytics.setUserId({
      userId: uId,
    });
  }

  cookbookViewed(cookbookId?: any, chefId?: any, ownMode?: any) {
    FirebaseAnalytics.logEvent({
      name: 'cookbook_viewed',
      params: {
        cookbookId: cookbookId,
        chefId: chefId,
        ownMode: ownMode,
        loggedIn: this.loggedIn
      }
    });
  };

  cookbookEdited(cookbookId?: any, chefId?: any) {
    FirebaseAnalytics.logEvent({
      name: 'cookbook_edited',
      params: {
        cookbookId: cookbookId,
        chefId: chefId,
        loggedIn: this.loggedIn
      }
    });
  };

  cookbookDeleted(cookbookId?: any, chefId?: any) {
    FirebaseAnalytics.logEvent({
      name: 'cookbook_deleted',
      params: {
        cookbookId: cookbookId,
        chefId: chefId,
        loggedIn: this.loggedIn
      }
    });
  };

  filterUsed(filters?: string[], filterValues?: string[]) {
    FirebaseAnalytics.logEvent({
      name: 'filter_used',
      params: {
        filters: filters,
        filterValues: filterValues,
        loggedIn: this.loggedIn
      }
    });
  }

  pagination(paginationTotal?: any, filters?: string[], filterValues?: string[]) {
    FirebaseAnalytics.logEvent({
      name: 'pagination',
      params: {
        paginationTotal: paginationTotal,
        filters: filters,
        filterValues: filterValues,
        loggedIn: this.loggedIn
      }
    });
  }

  textSearchSegmentUsed(segment?: any) {
    FirebaseAnalytics.logEvent({
      name: 'textSearch_segment_used',
      params: {
        segment: segment,
        loggedIn: this.loggedIn
      }
    });
  }

  viewRecipeDetails(recipeId?: any, ownMode?: any) {
    FirebaseAnalytics.logEvent({
      name: 'viewed_recipe_details',
      params: {
        recipeId: recipeId,
        ownMode: ownMode,
        loggedIn: this.loggedIn
      }
    });
  };

  recipeDetailsSegment(recipeId?: any, segment?: any, ownMode?: any) {
    FirebaseAnalytics.logEvent({
      name: 'recipe_details_segment_used',
      params: {
        recipeId: recipeId,
        segment: segment,
        ownMode: ownMode,
        loggedIn: this.loggedIn
      }
    });
  };

  recipeDetailsEdited(recipeId?: any, editedPortion?: any) {
    FirebaseAnalytics.logEvent({
      name: 'recipe_details_edited',
      params: {
        recipeId: recipeId,
        editedPortion: editedPortion,
        loggedIn: this.loggedIn
      }
    });
  }

  recipeDeleted(recipeId?: any) {
    FirebaseAnalytics.logEvent({
      name: 'recipe_deleted',
      params: {
        recipeId: recipeId,
        loggedIn: this.loggedIn
      }
    });
  }

  chefViewed(chefId?: any, ownMode?: any) {
    FirebaseAnalytics.logEvent({
      name: 'chef_details_viewed',
      params: {
        chefId: chefId,
        ownMode: ownMode,
        loggedIn: this.loggedIn
      }
    });
  }

  chefSegments(chefId?: any, ownMode?: any, segmentUsed?: any) {
    FirebaseAnalytics.logEvent({
      name: 'chef_segment_used',
      params: {
        chefId: chefId,
        ownMode: ownMode,
        segmentUsed: segmentUsed,
        loggedIn: this.loggedIn
      }
    });
  }

  chefInfoUpdated(chefId?: any, editedPortion?: any) {
    FirebaseAnalytics.logEvent({
      name: 'chef_info_updated',
      params: {
        chefId: chefId,
        editedPortion: editedPortion,
        loggedIn: this.loggedIn
      }
    });
  }

}
