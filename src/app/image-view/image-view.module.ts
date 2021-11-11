import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImageViewPageRoutingModule } from './image-view-routing.module';

import { ImageViewPage } from './image-view.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageViewPageRoutingModule,
    SharedModule
  ],
  declarations: [ImageViewPage]
})
export class ImageViewPageModule {}
