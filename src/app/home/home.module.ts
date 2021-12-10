import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { SharedModule } from '../shared/shared.module';

import { HomePageRoutingModule } from './home-routing.module';
import { NgAisModule } from 'angular-instantsearch';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule,
    NgAisModule,
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
