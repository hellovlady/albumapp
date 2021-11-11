import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectAlbumPageRoutingModule } from './select-album-routing.module';

import { SelectAlbumPage } from './select-album.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectAlbumPageRoutingModule,
    SharedModule
  ],
  declarations: [SelectAlbumPage]
})
export class SelectAlbumPageModule {}
