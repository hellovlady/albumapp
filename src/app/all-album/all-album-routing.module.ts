import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllAlbumPage } from './all-album.page';

const routes: Routes = [
  {
    path: '',
    component: AllAlbumPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllAlbumPageRoutingModule {}
