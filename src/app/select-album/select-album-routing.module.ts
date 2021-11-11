import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectAlbumPage } from './select-album.page';

const routes: Routes = [
  {
    path: '',
    component: SelectAlbumPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectAlbumPageRoutingModule {}
