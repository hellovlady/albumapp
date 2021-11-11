import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMyContactPage } from './add-my-contact.page';

const routes: Routes = [
  {
    path: '',
    component: AddMyContactPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMyContactPageRoutingModule {}
