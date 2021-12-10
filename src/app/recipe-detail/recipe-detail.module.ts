import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RecipeDetailComponent } from './recipe-detail.component';
import { RecipeDetailRoutingModule } from './recipe-detail-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SimpleMaskModule } from 'ngx-ion-simple-mask';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipeDetailRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    SimpleMaskModule
  ],
  declarations: [RecipeDetailComponent]
})
export class RecipeDetailModule {}
