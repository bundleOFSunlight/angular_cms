import { Routes } from '@angular/router';
import { forgotPassComponent } from 'src/app/pages/forgot_pass/forgot_pass.component';
import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';

export const AuthLayoutRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot_password', component: forgotPassComponent },
];
