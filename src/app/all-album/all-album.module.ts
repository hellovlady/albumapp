import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllAlbumPageRoutingModule } from './all-album-routing.module';

import { AllAlbumPage } from './all-album.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllAlbumPageRoutingModule,
    SharedModule,
  ],
  declarations: [AllAlbumPage]
})
export class AllAlbumPageModule {}
