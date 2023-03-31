import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuComponent } from 'src/app/pages/ar_menu/menu.component';
import { arMenuRoutes } from './ar_menu.routing';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(arMenuRoutes),
    NgbModule
  ],
  declarations: [
    MenuComponent
  ]
})

export class arMenuModule { }
