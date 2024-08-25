import {Component} from '@angular/core';
import {MenuItem} from "./domain/menuitem";
import {LoadingService} from "./service/loadingService";
import {AuthService} from "./auth/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'stock-analyst';
  items: MenuItem[] | any;

  constructor(public loadingService: LoadingService,
              private authService: AuthService) {
  }
  ngOnInit() {
    document.documentElement.style.fontSize = 14 + 'px';
    this.items = [
      {
        label: 'Menu',
        items: [
          {
            label: 'Portfolio',
            routerLink: '/portfolio'
          },
          {
            label: 'Price Alert',
            routerLink: '/price-alert'
          },
          {
            label: 'Logout',
            command: (): void => this.authService.logout()
          }
        ]
      }
    ];
  }

  handleMenu() {
    return this.authService.isAuthenticated();
  }

  localStorageItem(id: string) {
    return localStorage.getItem(id);
  }
}
