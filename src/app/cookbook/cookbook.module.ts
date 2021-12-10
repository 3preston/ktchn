import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CookbookComponent } from './cookbook.component';
import { CookbookPageRoutingModule } from './cookbook-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SimpleMaskModule } from 'ngx-ion-simple-mask';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CookbookPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    SimpleMaskModule
  ],
  declarations: [CookbookComponent]
})
export class CookbookPageModule {}
