import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxBootstrapConfirmModule } from 'ngx-bootstrap-confirm';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { AuthGuard } from './authGuard';
import { ComponentsModule } from './components/components.module';
import { arMenuComponent } from './layouts/aar-menu/ar_menu.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { successGuard } from './successGuard';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    NgxBootstrapConfirmModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    arMenuComponent,
  ],
  providers: [AuthGuard, successGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
