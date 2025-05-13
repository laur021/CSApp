import { Component, inject } from "@angular/core";
import { CardModule } from "primeng/card";
import { FocusTrapModule } from "primeng/focustrap";
import { ButtonModule } from "primeng/button";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { CheckboxModule } from "primeng/checkbox";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { AutoFocusModule } from "primeng/autofocus";
import { CommonModule } from "@angular/common";
import { PasswordModule } from "primeng/password";
import { IftaLabelModule } from "primeng/iftalabel";
import { ThemeService } from "../../core/services/_theme/theme.service";
import { Message } from "primeng/message";
import { AccountService } from "../../core/services/account/account.service";
import { Router } from "@angular/router";
import { ActivityLogService } from "../../core/services/activity-log/activity-log.service";
import { Activitylog } from "../../core/models/activity-log.models";
import { getPCName } from "../../core/functions/getPCName";

@Component({
  selector: "app-page-login",
  standalone: true,
  imports: [
    CardModule,
    FocusTrapModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    CheckboxModule,
    IconFieldModule,
    InputIconModule,
    AutoFocusModule,
    CommonModule,
    ReactiveFormsModule,
    PasswordModule,
    IftaLabelModule,
    Message,
  ],
  templateUrl: "./page-login.component.html",
  styleUrl: "./page-login.component.css",
})
export class PageLoginComponent {
  themeService = inject(ThemeService);
  accountService = inject(AccountService);
  activityLogService = inject(ActivityLogService);
  router = inject(Router);

  checked: boolean = this.themeService.isDarkTheme;
  loginFailed: boolean = false;
  isloggingIn: boolean = false;
  loginForm: FormGroup = new FormGroup({});
  loginObj: any = {
    username: "",
    password: "",
  };

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.checked = this.themeService.isDarkTheme;
  }

  onSubmit() {
    this.isloggingIn = true;
    this.accountService.login(this.loginForm.value).subscribe({
      next: (_) => {
        this.isloggingIn = false;
        this.router.navigateByUrl("/phone");
        this.insertLog(
          "Login success",
          this.accountService.activeUser()?.username ?? this.loginObj.username
        );
      },
      error: (_) => {
        this.isloggingIn = false;
        this.loginFailed = true;
        setTimeout(() => {
          this.loginFailed = false;
        }, 3000);
        this.insertLog(
          "Login failed",
          this.accountService.activeUser()?.username ?? this.loginObj.username
        );
      },
    });
  }

  insertLog(action: string, user: string) {
    const activityLog: Activitylog = {
      action: "Login",
      detail: action,
      // pcName: getPCName(),
      addedBy: this.accountService.activeUser()?.username ?? user,
    };

    this.activityLogService.add(activityLog).subscribe();
  }
}
