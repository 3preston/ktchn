/* eslint-disable @angular-eslint/no-input-rename */
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-recipes',
  templateUrl: './search-recipes.component.html',
  styleUrls: ['./search-recipes.component.scss'],
})
export class SearchRecipesComponent implements OnInit {

  @Input('recipe') recipe: any;

  constructor(private router: Router) { }

  ngOnInit() {}

  routeToRecipe(recipeId: any) {
    this.router.navigate(['/details', recipeId]);
  }

}
