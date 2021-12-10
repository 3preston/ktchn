/* eslint-disable @angular-eslint/no-input-rename */
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeModel } from '../recipe.model';

@Component({
  selector: 'app-recipe-main',
  templateUrl: './recipe-main.component.html',
  styleUrls: ['./recipe-main.component.scss'],
})
export class RecipeMainComponent {

  @Input('recipe') recipe: any;
  @Input('mode') mode: any;

  constructor(private router: Router) { }

  openRecipe() {
    if (this.mode === 'search') {
      this.router.navigate(['/details', this.recipe.objectID]);
    } else {
      this.router.navigate(['/details', this.recipe.id]);
    }
  }

}
