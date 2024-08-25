import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  parsedToken: any;
  authenticated: boolean = false;
  currentUser: any;

  constructor(public router: Router) {
    const token = this.getToken();
    if (token !== null && this.parsedToken == null) {
      this.parsedToken = jwtDecode(token);
    }
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  setAuthentication(accessToken: string) {
    localStorage.setItem('accessToken', accessToken);
    this.authenticated = true;
  }

  setProfile(data: any) {
    localStorage.setItem('firstName', data.firstName);
    localStorage.setItem('lastName', data.lastName);
    localStorage.setItem('imageUrl', data.imageUrl);
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('imageUrl');
    this.authenticated = false;
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

}
