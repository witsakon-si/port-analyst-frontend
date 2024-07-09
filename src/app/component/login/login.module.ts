import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {AppConfigService} from "../../service/appconfigservice";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CheckboxModule} from "primeng/checkbox";
import {LoginComponent} from "./login.component";
import {LoginRoutingModule} from "./login-routing.module";
import {ButtonModule} from "primeng/button";


@NgModule({
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    ButtonModule,
    LoginRoutingModule,
  ],
  declarations: [LoginComponent],
  providers: [AppConfigService],
})
export class LoginModule { }
