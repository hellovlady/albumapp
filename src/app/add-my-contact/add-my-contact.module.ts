import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMyContactPageRoutingModule } from './add-my-contact-routing.module';

import { AddMyContactPage } from './add-my-contact.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMyContactPageRoutingModule
  ],
  declarations: [AddMyContactPage]
})
export class AddMyContactPageModule {}
