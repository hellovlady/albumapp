import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'otp/:phone_number',
    loadChildren: () => import('./otp/otp.module').then( m => m.OtpPageModule)
  },
  {
    path: 'contact-list',
    loadChildren: () => import('./contact-list/contact-list.module').then( m => m.ContactListPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'comments/:id',
    loadChildren: () => import('./comments/comments.module').then( m => m.CommentsPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit-album',
    loadChildren: () => import('./edit-album/edit-album.module').then( m => m.EditAlbumPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'user-album/:id',
    loadChildren: () => import('./user-album/user-album.module').then( m => m.UserAlbumPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'select-album',
    loadChildren: () => import('./select-album/select-album.module').then( m => m.SelectAlbumPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'all-album',
    loadChildren: () => import('./all-album/all-album.module').then( m => m.AllAlbumPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'caption/:id',
    loadChildren: () => import('./caption/caption.module').then( m => m.CaptionPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'image-view/:id',
    loadChildren: () => import('./image-view/image-view.module').then( m => m.ImageViewPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'add-image-caption',
    loadChildren: () => import('./add-image-caption/add-image-caption.module').then( m => m.AddImageCaptionPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'my-contacts',
    loadChildren: () => import('./my-contacts/my-contacts.module').then( m => m.MyContactsPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'likes',
    loadChildren: () => import('./likes/likes.module').then( m => m.LikesPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'add-my-contact',
    loadChildren: () => import('./add-my-contact/add-my-contact.module').then( m => m.AddMyContactPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
