import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CaptionPage } from './caption.page';

const routes: Routes = [
  {
    path: '',
    component: CaptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaptionPageRoutingModule {}
