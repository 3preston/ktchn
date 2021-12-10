import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { AuthPageRoutingModule } from './auth-routing.module';
import { SimpleMaskModule } from 'ngx-ion-simple-mask';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthPageRoutingModule,
    SimpleMaskModule
  ],
  declarations: [AuthComponent]
})
export class AuthPageModule {}
