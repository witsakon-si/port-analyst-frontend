import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {AuthProvider} from "../../domain/authProvider";
import {Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {ApiService} from "../../service/api.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  authProvider?: AuthProvider;

  constructor(private http: HttpClient,
              private formBuilder: UntypedFormBuilder,
              private authService: AuthService,
              private apiService: ApiService,
              private router: Router,
              private messageService: MessageService) {

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/price-alert']);
    }

    this.loginForm = new UntypedFormGroup({
      'email': new UntypedFormControl('', Validators.required),
      'password': new UntypedFormControl('', Validators.required),
      'usePin': new UntypedFormControl(false, Validators.required),
      'timeoutPin': new UntypedFormControl(0, Validators.required),
    });
  }

  ngOnInit(): void {
  }

  onSubmitLogin() {
    this.apiService.post('/auth/login', this.loginForm.value)
      .subscribe(
        resp => {
          if (resp) {
            console.log(resp)
            const token = JSON.parse(JSON.stringify(resp)).accessToken;
            if (token) {
              this.authProvider = AuthProvider.local;
              this.authService.setAuthentication(token);
              this.router.navigate(['/price-alert', this.authProvider], {state: {from: this.router.routerState.snapshot.url}});
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Login failed!',
                detail: "Invalid username or password",
                life: 3000
              });
            }
          }
        }, error => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: 3000});
        }
      );
  }

  loginWithGoogle() {
    window.location.href = `${environment.apiURL}/oauth2/authorize/google?redirect_uri=${location.origin}/oauth2/google/redirect`;
  }
}
