import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AlbumComponent } from './component/album/album.component';
import { ContactComponent } from './component/contact/contact.component';
import { CommentComponent } from './component/comment/comment.component';
import { FormsModule } from '@angular/forms';
import { ContactListPageRoutingModule } from '../contact-list/contact-list-routing.module';
import { CaptionComponent } from './component/caption/caption.component';
import { UserPopoverComponent } from './component/user-popover/user-popover.component';
import { ImagePopoverComponent } from './component/image-popover/image-popover.component';
import { AddImageComponent } from './component/modal/add-image/add-image.component';
import { ViewComponent } from './component/modal/view/view.component';
import { CommentModalComponent } from './component/modal/comment-modal/comment-modal.component';
import { MyContactComponent } from './component/my-contact/my-contact.component';
import { LikeCardComponent } from './component/like-card/like-card.component';
import { MyContactsPageRoutingModule } from '../my-contacts/my-contacts-routing.module';
import { AddMyContactComponent } from './component/modal/add-my-contact/add-my-contact.component';

@NgModule({
  declarations: [
    AlbumComponent,
    ContactComponent,
    CommentComponent,
    CaptionComponent,
    UserPopoverComponent,
    ImagePopoverComponent,
    AddImageComponent,
    ViewComponent,
    CommentModalComponent,
    MyContactComponent,
    LikeCardComponent,
    AddMyContactComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactListPageRoutingModule,
    MyContactsPageRoutingModule
  ],
  exports: [
    AlbumComponent,
    ContactComponent,
    CommentComponent,
    CaptionComponent,
    UserPopoverComponent,
    ImagePopoverComponent,
    AddImageComponent,
    ViewComponent,
    CommentModalComponent,
    MyContactComponent,
    LikeCardComponent,
    AddMyContactComponent

  ]
})
export class SharedModule { }
