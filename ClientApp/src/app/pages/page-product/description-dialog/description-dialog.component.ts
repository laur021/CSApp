import { NgIf } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { Message } from "primeng/message";
import { AccountService } from "../../../core/services/account/account.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { Description } from "../../../core/models/description.models";
import { DescriptionService } from "../../../core/services/description/description.service";
import { TextareaModule } from "primeng/textarea";
import { DescriptionLog } from "../../../core/models/description-log.model";
import { DescriptionLogService } from "../../../core/services/description-log/description-log.service";

@Component({
  selector: "app-description-dialog",
  standalone: true,
  imports: [
    Message,
    InputTextModule,
    ButtonModule,
    NgIf,
    ReactiveFormsModule,
    ToastModule,
    TextareaModule,
  ],
  templateUrl: "./description-dialog.component.html",
  styleUrl: "./description-dialog.component.css",
  providers: [MessageService],
})
export class DescriptionDialogComponent implements OnInit {
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig<any>); // Inject to receive data from parent
  fb = inject(FormBuilder);
  accountService = inject(AccountService);
  descriptionService = inject(DescriptionService);
  descriptionLogService = inject(DescriptionLogService);
  private readonly messageService = inject(MessageService);

  myForm!: FormGroup;
  isSubmitting = false;
  data: any; // Initialize as null for new description
  private initialFormValue!: any;

  constructor() {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.data = this.config.data || null; // Set description data if available
    this.patchValueForm();
    this.initialFormValue = this.myForm.value;
  }

  initializeForm(): void {
    this.myForm = this.fb.group({
      descName: [
        "",
        [
          Validators.required,
          Validators.maxLength(250),
          this.noBlankSpacesValidator,
        ],
      ],
    });
  }

  isFormUnchanged(): boolean {
    return (
      JSON.stringify(this.initialFormValue) ===
      JSON.stringify(this.myForm.value)
    );
  }

  patchValueForm(): void {
    if (this.data.description) {
      this.myForm.patchValue({
        descName: this.data.description.name,
      });
    }
  }

  get descName() {
    return this.myForm.get("descName");
  }

  // Custom Validator: Disallow only spaces
  private noBlankSpacesValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    return control.value?.trim().length === 0
      ? { invalidDescription: true }
      : null;
  }

  onSubmit(): void {
    if (this.myForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    const descToBeAdd: Description = {
      id: this.data.description?.id || 0, // Use 0 or generate a new ID for new products
      name: this.myForm.value.descName.trim(), // Correctly extract the form value
      addedBy: this.accountService.activeUser()?.username ?? "Unknown",
      dateAdded: new Date(),
      productId: this.data.description
        ? this.data.description?.productId!
        : this.data.product.id,
    };

    const apiCall = this.data.description
      ? this.descriptionService.update(descToBeAdd.id!, descToBeAdd)
      : this.descriptionService.add(descToBeAdd);

    apiCall.subscribe({
      next: (res) => {
        this.isSubmitting = false;

        if (!this.data.description) {
          descToBeAdd.id = res.id;
        }

        this.addDescLog(descToBeAdd);

        this.ref.close({
          status: true,
          action: this.data.description ? "updated" : "added",
        });

        this.myForm.reset();
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 409) {
          this.myForm.get("descName")?.setErrors({ nameTaken: true });
        }
      },
    });
  }

  addDescLog(description: Description): void {
    const log: DescriptionLog = {
      action: this.data.description ? "Update" : "Create",
      detail: description.name,
      addedBy: this.accountService.activeUser()?.username!,
      descriptionId: description?.id!,
    };
    this.descriptionLogService.add(log).subscribe();
  }
}
