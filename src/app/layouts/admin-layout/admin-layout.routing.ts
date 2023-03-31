import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/restaurant/restaurant.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { UserCrudComponent } from '../../pages/user_crud/user_crud.component';
import { UserManagementComponent } from '../../pages/user_management/user_management.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'restaurant', component: UserProfileComponent },
    { path: 'tables', component: TablesComponent },
    { path: 'user_management', component: UserManagementComponent },
    { path: 'user_crud', component: UserCrudComponent },
];
