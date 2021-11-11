import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddImageCaptionPageRoutingModule } from './add-image-caption-routing.module';

import { AddImageCaptionPage } from './add-image-caption.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddImageCaptionPageRoutingModule
  ],
  declarations: [AddImageCaptionPage]
})
export class AddImageCaptionPageModule {}
