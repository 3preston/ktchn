import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PrivacyComponent } from './privacy.component';
import { PrivacyComponentRoutingModule } from './privacy-routing.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PrivacyComponentRoutingModule
  ],
  declarations: [PrivacyComponent]
})
export class PrivacyComponentModule {}
