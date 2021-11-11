import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactListPageRoutingModule } from './contact-list-routing.module';

import { ContactListPage } from './contact-list.page';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactListPageRoutingModule,
    SharedModule,
  ],
  declarations: [ContactListPage],
})
export class ContactListPageModule {}
