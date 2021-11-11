import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CaptionPageRoutingModule } from './caption-routing.module';

import { CaptionPage } from './caption.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CaptionPageRoutingModule,
    SharedModule
  ],
  declarations: [CaptionPage]
})
export class CaptionPageModule {}
