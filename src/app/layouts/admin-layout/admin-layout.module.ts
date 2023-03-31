import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClipboardModule } from 'ngx-clipboard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/restaurant/restaurant.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { UserCrudComponent } from '../../pages/user_crud/user_crud.component';
import { UserManagementComponent } from '../../pages/user_management/user_management.component';
import { AdminLayoutRoutes } from './admin-layout.routing';
// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    UserManagementComponent,
    UserCrudComponent,
    TablesComponent,
  ]
})

export class AdminLayoutModule { }
