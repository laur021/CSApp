import { Component, inject, OnInit } from "@angular/core";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { Message } from "primeng/message";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { AccountService } from "../../core/services/account/account.service";
import { ResetPassword } from "../../core/models/account.models";
import { getPCName } from "../../core/functions/getPCName";
import { Activitylog } from "../../core/models/activity-log.models";
import { ActivityLogService } from "../../core/services/activity-log/activity-log.service";
import { NgIf } from "@angular/common";
import { MessageService } from "primeng/api";
import { Toast, ToastModule } from "primeng/toast";

@Component({
  selector: "app-page-profile",
  standalone: true,
  imports: [
    CardModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    ButtonModule,
    Message,
    NgIf,
    Toast
],
  templateUrl: "./page-profile.component.html",
  styleUrls: ["./page-profile.component.css"],
  providers: [MessageService, ToastModule],
})
export class PageProfileComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly fb = inject(FormBuilder);
  private readonly activityLogService = inject(ActivityLogService);
  private readonly messageService = inject(MessageService);

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  isSubmitting = false;
  userId = this.accountService.activeUser()?.id;

  ngOnInit(): void {
    this.initializeForms();
    this.fetchAccountData();
  }

  /**
   * Initialize the profile and password forms.
   */
  private initializeForms(): void {
    // Initialize profileForm with disabled controls
    this.profileForm = this.fb.group({
      username: [{ value: "", disabled: true }],
      fullName: [{ value: "", disabled: true }],
      role: [{ value: "", disabled: true }],
      status: [{ value: "", disabled: true }],
      password: [{ value: "", disabled: true }],
    });

    // Initialize passwordForm
    this.passwordForm = this.fb.group(
      {
        newPassword: [
          "",
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        confirmPassword: ["", Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  /**
   * Fetch account data and populate the profile form.
   */
  private fetchAccountData(): void {
    if (!this.userId) return;

    this.accountService.get(this.userId).subscribe({
      next: (data) => {
        this.profileForm.patchValue({
          username: data.username,
          fullName: data.fullName,
          role: data.role,
          status: data.status,
          password: data.password,
        });
      },
      error: (err) => alert(err.error),
    });
  }

  /**
   * Clear the password form fields.
   */
  clearFields(): void {
    this.passwordForm.markAsUntouched();
    this.passwordForm.reset();
  }

  /**
   * Handle form submission to update the password.
   */
  onSubmit(): void {
    if (this.passwordForm.invalid || !this.userId) return;

    this.isSubmitting = true;

    const newPassword: ResetPassword = {
      newPassword: this.passwordForm.get("newPassword")?.value,
    };

    this.accountService.updatePassword(this.userId, newPassword).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.passwordForm.reset();
        setTimeout(() => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: `Password successfully updated.`,
            life: 3000,
          });
        }, 50);
        this.fetchAccountData();
        this.insertLog(
          "Password changed",
          this.accountService.activeUser()?.username ?? "Unknown"
        );
      },
      error: () => {
        this.isSubmitting = false;
        setTimeout(() => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: `Something went wrong. Please try again.`,
            life: 3000,
          });
        }, 50);
      },
    });
  }

  /**
   * Insert an activity log for the password change action.
   */
  private insertLog(action: string, user: string): void {
    const activityLog: Activitylog = {
      action: "Change Password",
      detail: action,
      // pcName: getPCName(),
      addedBy: user,
      dateAdded: new Date(),
    };

    this.activityLogService.add(activityLog).subscribe();
  }

  /**
   * Custom validator to check if passwords match.
   */
  private passwordsMatchValidator(
    formGroup: AbstractControl
  ): ValidationErrors | null {
    const newPassword = formGroup.get("newPassword");
    const confirmPassword = formGroup.get("confirmPassword");

    if (!newPassword || !confirmPassword) return null;

    if (newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordsMismatch: true });
      return { passwordsMismatch: true };
    } else {
      confirmPassword.setErrors(null);
      return null;
    }
  }
}
