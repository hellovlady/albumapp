import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserAlbumPageRoutingModule } from './user-album-routing.module';

import { UserAlbumPage } from './user-album.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserAlbumPageRoutingModule,
    SharedModule
  ],
  declarations: [UserAlbumPage]
})
export class UserAlbumPageModule {}
