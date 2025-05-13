import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { AccountService } from '../../../core/services/account/account.service';
import { ROLE } from '../../../core/constants/role';
import { USER_STATUS } from '../../../core/constants/user_status';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Account } from '../../../core/models/account.models';
import { PasswordModule } from 'primeng/password';
import { USER_TEAM } from '../../../core/constants/user_team';

@Component({
  selector: 'app-dialog-user',
  standalone: true,
  imports: [
    FormsModule,
    SelectModule,
    TextareaModule,
    DatePickerModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    NgIf,
    MessageModule,
    PasswordModule,
  ],
  templateUrl: './dialog-user.component.html',
  styleUrl: './dialog-user.component.css',
})
export class DialogUserComponent implements OnInit {
  accountService = inject(AccountService);
  private readonly fb = inject(FormBuilder);
  config = inject(DynamicDialogConfig<Account>); // Inject to receive data from parent
  ref = inject(DynamicDialogRef);
  ROLE = Object.values(ROLE)
    .filter((role) =>
      this.accountService.activeUser()?.role !== ROLE.ADMIN
        ? role !== ROLE.ADMIN
        : role
    ) // Exclude ADMIN role if the current user role is not admin.
    .map((role) => ({ role: role }));
  TEAM = Object.values(USER_TEAM).map((team) => ({ team }));
  FILTERED_TEAM = this.TEAM.filter(
    (t) => t.team === this.accountService.activeUser()?.team
  );
  STATUS = Object.values(USER_STATUS).map((status) => ({ status: status }));
  isSubmitting: boolean = false;
  Account: Account = this.config.data;
  myForm!: FormGroup;
  initialFormValue!: any; // Store initial form values

  ngOnInit(): void {
    // Form Initialization
    this.myForm = this.fb.group({
      id: [0],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      fullName: ['', [Validators.required, Validators.maxLength(50)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
      role: ['', [Validators.required, Validators.maxLength(20)]],
      team: [
        this.accountService.activeUser()?.team,
        [Validators.required, Validators.maxLength(2)],
      ],
      status: [
        USER_STATUS.ACTIVE,
        [Validators.required, Validators.maxLength(20)],
      ],
      dateAdded: [null],
    });

    if (this.Account) {
      this.myForm.patchValue(this.Account); // Populate form when editing
      this.initialFormValue = this.myForm.getRawValue(); // Store initial values
    } else {
      this.initialFormValue = this.myForm.getRawValue(); // Store initial values for new user
    }

    // Track changes
    this.myForm.valueChanges.subscribe(() => {
      this.isFormUnchanged();
    });
  }

  isFormUnchanged(): boolean {
    return (
      JSON.stringify(this.myForm.getRawValue()) ===
      JSON.stringify(this.initialFormValue)
    );
  }

  onSubmit(): void {
    if (this.myForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const userData = {
      ...this.myForm.value,
      addedBy: this.accountService.activeUser()?.username,
    };

    (!this.Account
      ? this.accountService.add(userData)
      : this.accountService.updateDetails(userData.id, userData)
    ).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.ref.close({
          status: true,
          action: this.Account ? 'updated' : 'added',
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 409) {
          this.myForm.get('username')?.setErrors({ usernameTaken: true });
        }
      },
    });
  }
}
