import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserAlbumPage } from './user-album.page';

const routes: Routes = [
  {
    path: '',
    component: UserAlbumPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAlbumPageRoutingModule {}
