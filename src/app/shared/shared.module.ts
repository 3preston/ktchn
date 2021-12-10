/* eslint-disable max-len */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RecipeMainComponent } from './recipe-main/recipe-main.component';
import { RecipeInfoComponent } from './recipe-info/recipe-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecipeIngredientsComponent } from './recipe-ingredients/recipe-ingredients.component';
import { RecipeInstructionsComponent } from './recipe-instructions/recipe-instructions.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { CookbookSelectorComponent } from './cookbook-selector/cookbook-selector.component';
import { ImagePickerComponent } from './image-picker/image-picker.component';
import { RecipeStoryComponent } from './recipe-story/recipe-story.component';
import { NgAisModule } from 'angular-instantsearch';
import { SearchRecipesComponent } from './search-recipes/search-recipes.component';


@NgModule({
    declarations: [
      RecipeMainComponent,
      RecipeInfoComponent,
      RecipeIngredientsComponent,
      RecipeInstructionsComponent,
      ProfileInfoComponent,
      CookbookSelectorComponent,
      ImagePickerComponent,
      RecipeStoryComponent,
      SearchRecipesComponent,
    ],
    imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule, NgAisModule],
    exports: [
      RecipeMainComponent,
      RecipeInfoComponent,
      RecipeIngredientsComponent,
      RecipeInstructionsComponent,
      ProfileInfoComponent,
      CookbookSelectorComponent,
      ImagePickerComponent,
      RecipeStoryComponent,
      SearchRecipesComponent
    ]
})
export class SharedModule {}
