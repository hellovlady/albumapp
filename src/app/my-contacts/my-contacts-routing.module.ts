import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyContactsPage } from './my-contacts.page';

const routes: Routes = [
  {
    path: '',
    component: MyContactsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyContactsPageRoutingModule {}
