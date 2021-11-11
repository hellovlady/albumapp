import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAlbumPageRoutingModule } from './edit-album-routing.module';

import { EditAlbumPage } from './edit-album.page';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditAlbumPageRoutingModule,
    SharedModule
  ],
  declarations: [EditAlbumPage]
})
export class EditAlbumPageModule {}
