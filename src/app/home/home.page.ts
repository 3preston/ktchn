/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable no-var */
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from '../auth/auth.service';
import { RecipeModel } from '../shared/recipe.model';
import { AlgoliaService } from './algolia.service';
import { AnalyticsService } from '../shared/analytics.service';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  recipes: RecipeModel[] = [];
  dataCollection: AngularFirestoreCollection<any>;
  dataSub: Subscription;
  data: any;

  lastDoc: any;
  pagination = 0;
  noneAvailable = false;
  paginationFinished = false;
  pagLoading = false;

  isLoading = false;
  loggedIn = false;
  userPic: any;

  chosenCategory: any;
  chosenTime: any;

  chosenSegment = 'recipes';

  hits: any = [];
  searchUsed = false;
  userHits: any = [];
  userHitsTemp: any = [];
  searchTerms: any;

  constructor(private menu: MenuController,
              private analytics: AnalyticsService,
              private authService: AuthService,
              private algoliaSearch2: AlgoliaService,
              private firestore: AngularFirestore) {}

  ngOnInit() {
    this.isLoading = true;
    this.dataCollection = this.firestore.collection('recipes', (ref) =>
    ref.orderBy('date', 'desc').limit(33));
    this.data = this.dataCollection.get();
      this.dataSub = this.data.subscribe(recipes => {
        recipes.forEach((doc => {
          this.recipes.push({
            id: doc.id,
            ...doc.data()
          });
        }));
      this.isLoading = false;

      //pagination setup
      this.pagination = this.recipes.length;
      this.lastDoc = this.recipes[this.pagination-1];
      if (this.pagination < 33) {
        this.paginationFinished = true;
      }

    });
    //get user info
    this.authService.userInfo.subscribe(userInfo => {
      if (userInfo == null) {
        this.loggedIn = false;
      } else {
        this.loggedIn = true;
        this.userPic = userInfo.chefPic;
      }
    });
  }

  openMenu() {
    this.menu.open();
  }

  openKeyboard() {
    Keyboard.show();
  }

  closeKeyboard() {
    Keyboard.hide();
  }

  clearFilter() {
    this.chosenCategory = null;
    this.chosenTime = null;
    this.updateFilter();
  }

  updateFilter() {
    this.recipes = [];
    this.isLoading = true;
    this.pagination = 0;
    this.paginationFinished = false;
    this.noneAvailable = false;
     if (this.chosenCategory && this.chosenTime) {
      const time = this.chosenTime.split('-');
      const minutesLow = +time[0];
      const minutesHigh = +time[1];
      this.dataCollection = this.firestore.collection('recipes', (ref) => ref
      .where('recipeType', 'array-contains', this.chosenCategory)
      .where('minutes', '<=', minutesHigh)
      .where('minutes', '>=', minutesLow)
      .orderBy('minutes')
      .orderBy('date', 'desc')
      .limit(33));
      this.data = this.dataCollection.get();
      this.dataSub = this.data.subscribe(recipes => {
        recipes.forEach((doc => {
          this.recipes.push({
            id: doc.id,
            ...doc.data()
          });
        }));
        this.isLoading = false;

      //pagination setup
      this.pagination = this.recipes.length;
      this.lastDoc = this.recipes[this.pagination-1];
      if (this.pagination < 33) {
        this.paginationFinished = true;
      }
      if (this.pagination < 1) {
        this.noneAvailable = true;
      }
      const filters = ['category', 'time'];
      const filterValues = [this.chosenCategory, this.chosenTime];
      this.analytics.filterUsed(filters, filterValues);
      });
    } else if (this.chosenCategory) {
      this.dataCollection = this.firestore.collection('recipes', (ref) => ref
      .where('recipeType', 'array-contains', this.chosenCategory)
      .orderBy('date', 'desc')
      .limit(33));
      this.data = this.dataCollection.get();
      this.dataSub = this.data.subscribe(recipes => {
        recipes.forEach((doc => {
          this.recipes.push({
            id: doc.id,
            ...doc.data()
          });
        }));
        this.isLoading = false;

        //pagination setup
        this.pagination = this.recipes.length;
        this.lastDoc = this.recipes[this.pagination-1];
        if (this.pagination < 33) {
          this.paginationFinished = true;
        }
        if (this.pagination < 1) {
          this.noneAvailable = true;
        }
        const filters = ['category'];
        const filterValues = [this.chosenCategory];
        this.analytics.filterUsed(filters, filterValues);
      });
    } else if (this.chosenTime) {
      const time = this.chosenTime.split('-');
      const minutesLow = +time[0];
      const minutesHigh = +time[1];
      this.dataCollection = this.firestore.collection('recipes', (ref) => ref
      .where('minutes', '<=', minutesHigh)
      .where('minutes', '>=', minutesLow)
      .orderBy('minutes')
      .orderBy('date', 'desc')
      .limit(33));
      this.data = this.dataCollection.get();
      this.dataSub = this.data.subscribe(recipes => {
        recipes.forEach((doc => {
          this.recipes.push({
            id: doc.id,
            ...doc.data()
          });
        }));
        this.isLoading = false;

        //pagination setup
        this.pagination = this.recipes.length;
        this.lastDoc = this.recipes[this.pagination-1];
        if (this.pagination < 33) {
          this.paginationFinished = true;
        }
        if (this.pagination < 1) {
          this.noneAvailable = true;
        }
        const filters = ['time'];
        const filterValues = [this.chosenTime];
        this.analytics.filterUsed(filters, filterValues);
      });
    } else {
      this.dataCollection = this.firestore.collection('recipes', (ref) => ref
      .orderBy('date', 'desc')
      .limit(33));
      this.data = this.dataCollection.snapshotChanges();
      this.dataSub = this.data.subscribe(recipes => {
        this.recipes = recipes.map(recipe => {
          return {
            id: recipe.payload.doc.id,
            ...recipe.payload.doc.data()
          };
        });
        this.isLoading = false;

        //pagination setup
        this.pagination = this.recipes.length;
        this.lastDoc = this.recipes[this.pagination-1];
        if (this.pagination < 33) {
          this.paginationFinished = true;
        }
        if (this.pagination < 1) {
          this.noneAvailable = true;
        }
      });
    }
  }

  async filter(event: any) {
    //segment data, if statements, then hits for each segment
    this.noneAvailable = false;
    this.searchUsed = true;
    if (this.searchTerms !== '') {

      //recipe/ingredients hits
      var index = await this.algoliaSearch2.searchClient.initIndex('recipes');
      var hits = await index.search(this.searchTerms, {
        hitsPerPage: 100
      });
      this.hits = hits.hits;
      //user hits
      var indexUsers = await this.algoliaSearch2.searchClient.initIndex('users');
      var userHits = await indexUsers.search(this.searchTerms, {
        hitsPerPage: 50
      });
      this.userHits = [];
      this.userHitsTemp = userHits.hits;
      this.userHitsTemp.forEach(element => {
        if (element.chefLevel === 'Chef') {
          this.userHits.push(element);
        }
      });

      if (this.hits.length < 1 && this.userHits < 1) {
        this.noneAvailable = true;
      }

    } else {
      this.hits = [];
      this.userHits = [];
      this.userHitsTemp = [];
      this.searchUsed = false;
    }
  }

  // async segmentChanged(event: any) {
  //   this.hits = [];
  //   this.userHits = [];
  //   this.userHitsTemp = [];
  //   this.noneAvailable = false;
  //   if (this.searchTerms !== '') {
  //     if (this.chosenSegment === 'chefs') {
  //       //user hits
  //       var indexUsers = await this.algoliaSearch2.searchClient.initIndex('users');
  //       var userHits = await indexUsers.search(this.searchTerms, {
  //         hitsPerPage: 100
  //       });
  //       this.userHits = [];
  //       this.userHitsTemp = userHits.hits;
  //       this.userHitsTemp.forEach(element => {
  //         if (element.chefLevel === 'Chef') {
  //           this.userHits.push(element);
  //         }
  //       });
  //     } else {
  //         //recipe/ingredients hits
  //         var index = await this.algoliaSearch2.searchClient.initIndex('recipes');
  //         var hits = await index.search(this.searchTerms, {
  //           hitsPerPage: 50
  //         });
  //         this.hits = hits.hits;
  //     }
  //   } else {
  //     this.hits = [];
  //     this.userHits = [];
  //     this.userHitsTemp = [];
  //     this.searchUsed = false;
  //   }
  //   if (this.hits.length < 1 && this.userHits < 1) {
  //     this.noneAvailable = true;
  //   }
  //   this.analytics.textSearchSegmentUsed(this.chosenSegment);
  // }

  paginationNext() {
    this.pagLoading = true;
    var sizeFull = this.pagination + 33;

    if (this.chosenCategory && this.chosenTime) {
      const time = this.chosenTime.split('-');
      const minutesLow = +time[0];
      const minutesHigh = +time[1];
      this.dataCollection = this.firestore.collection('recipes', (ref) => ref
      .where('recipeType', 'array-contains', this.chosenCategory)
      .where('minutes', '<=', minutesHigh)
      .where('minutes', '>=', minutesLow)
      .orderBy('minutes')
      .orderBy('date', 'desc')
      .startAfter(this.lastDoc.minutes)
      .limit(33));
      this.data = this.dataCollection.get();
      this.dataSub = this.data.subscribe(recipes => {
        recipes.forEach((doc => {
          this.recipes.push({
            id: doc.id,
            ...doc.data()
          });
        }));
        this.pagLoading = false;

        //pagination setup
        this.pagination = this.recipes.length;
        this.lastDoc = this.recipes[this.pagination-1];
        if (this.pagination < sizeFull) {
          this.paginationFinished = true;
        }
        const filters = ['category', 'time'];
        const filterValues = [this.chosenCategory, this.chosenTime];
        this.analytics.pagination(this.pagination, filters, filterValues);
      });
    } else if (this.chosenCategory) {
      this.dataCollection = this.firestore.collection('recipes', (ref) =>
      ref.where('recipeType', 'array-contains', this.chosenCategory)
      .orderBy('date', 'desc')
      .startAfter(this.lastDoc.date)
      .limit(33));
      this.data = this.dataCollection.get();
      this.dataSub = this.data.subscribe(recipes => {
        recipes.forEach((doc => {
          this.recipes.push({
            id: doc.id,
            ...doc.data()
          });
        }));
        this.pagLoading = false;

        //pagination setup
        this.pagination = this.recipes.length;
        this.lastDoc = this.recipes[this.pagination-1];
        if (this.pagination < sizeFull) {
          this.paginationFinished = true;
        }
        const filters = ['category'];
        const filterValues = [this.chosenCategory];
        this.analytics.pagination(this.pagination, filters, filterValues);
      });
    } else if (this.chosenTime) {
      const time = this.chosenTime.split('-');
      const minutesLow = +time[0];
      const minutesHigh = +time[1];
      this.dataCollection = this.firestore.collection('recipes', (ref) => ref
      .where('minutes', '<=', minutesHigh)
      .where('minutes', '>=', minutesLow)
      .orderBy('minutes')
      .orderBy('date', 'desc')
      .startAfter(this.lastDoc.minutes)
      .limit(33));
      this.data = this.dataCollection.get();
      this.dataSub = this.data.subscribe(recipes => {
        recipes.forEach((doc => {
          this.recipes.push({
            id: doc.id,
            ...doc.data()
          });
        }));
        this.pagLoading = false;

        //pagination setup
        this.pagination = this.recipes.length;
        this.lastDoc = this.recipes[this.pagination-1];
        if (this.pagination < sizeFull) {
          this.paginationFinished = true;
        }
        const filters = ['time'];
        const filterValues = [this.chosenTime];
        this.analytics.pagination(this.pagination, filters, filterValues);
      });
    } else {
      this.dataCollection = this.firestore.collection('recipes', (ref) => ref
      .orderBy('date', 'desc')
      .startAfter(this.lastDoc.date)
      .limit(33));
      this.data = this.dataCollection.get();
      this.dataSub = this.data.subscribe(recipes => {
        recipes.forEach((doc => {
          this.recipes.push({
            id: doc.id,
            ...doc.data()
          });
        }));
        this.pagLoading = false;

        // //pagination setup
        this.pagination = this.recipes.length;
        this.lastDoc = this.recipes[this.pagination-1];
        if (this.pagination < sizeFull) {
          this.paginationFinished = true;
        }
        const filters = [];
        const filterValues = [];
        this.analytics.pagination(this.pagination, filters, filterValues);
      });
    }
  }

  logoClicked() {
    this.searchTerms = '';
    this.searchUsed = false;
    this.clearFilter();
  }

}
