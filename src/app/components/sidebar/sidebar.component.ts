import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  // { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '' },
  // { path: '/icons', title: 'Icons', icon: 'ni-planet text-blue', class: '' },
  { path: '/tables', title: 'Restaurant', icon: 'ni ni-shop text-green', class: '' },
  { path: '/user_management', title: 'User', icon: 'ni ni-single-02 text-orange', class: '' },
  // { path: '/restaurant', title: 'Add Restaurant', icon: 'ni-single-02 text-blue', class: '' },
  // { path: '/login', title: 'Login', icon: 'ni-key-25 text-info', class: '' },
  // { path: '/register', title: 'Register', icon: 'ni-circle-08 text-pink', class: '' },
  // { path: '/forgot', title: 'ForgotPass', icon: 'ni-circle-08 text-pink', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    const user = localStorage.getItem("user");
    if (!user) {
      this.router.navigate(["/login"])
    }
    const user_body = JSON.parse(user)
    if (user_body.role !== "ADMIN") {
      ROUTES.pop()
    }
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  logout() {
    localStorage.clear()
    this.router.navigate(["/login"])
  }

}
