import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { LegalComponent } from './legal.component';
import { LegalPageRoutingModule } from './legal-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SimpleMaskModule } from 'ngx-ion-simple-mask';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LegalPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    SimpleMaskModule
  ],
  declarations: [LegalComponent]
})
export class LegalPageModule {}
