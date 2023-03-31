import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './authGuard';
import { arMenuComponent } from './layouts/aar-menu/ar_menu.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { successGuard } from './successGuard';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    redirectTo: 'tables',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
      }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [successGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
      }
    ]
  },
  {
    path: '',
    component: arMenuComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../app/layouts/aar-menu/ar_menu.module').then(m => m.arMenuModule)
      }
    ]
  },
  {
    path: '**',
    canActivate: [AuthGuard],
    redirectTo: 'tables',
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
