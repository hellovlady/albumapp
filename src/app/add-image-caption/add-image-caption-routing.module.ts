import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddImageCaptionPage } from './add-image-caption.page';

const routes: Routes = [
  {
    path: '',
    component: AddImageCaptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddImageCaptionPageRoutingModule {}
