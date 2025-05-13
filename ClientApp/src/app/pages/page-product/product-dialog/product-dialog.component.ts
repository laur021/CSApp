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
import { Product } from "../../../core/models/product.models";
import { ProductService } from "../../../core/services/product/product.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { ProductLog } from "../../../core/models/product-log.models";
import { ProductLogService } from "../../../core/services/product-log/product-log.service";

@Component({
  selector: "app-product-dialog",
  standalone: true,
  imports: [
    Message,
    InputTextModule,
    ButtonModule,
    NgIf,
    ReactiveFormsModule,
    ToastModule,
  ],
  templateUrl: "./product-dialog.component.html",
  styleUrl: "./product-dialog.component.css",
  providers: [MessageService],
})
export class ProductDialogComponent implements OnInit {
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig<Product>); // Inject to receive data from parent
  fb = inject(FormBuilder);
  accountService = inject(AccountService);
  productService = inject(ProductService);
  productLogService = inject(ProductLogService);
  private readonly messageService = inject(MessageService);

  myForm!: FormGroup;
  isSubmitting = false;
  product: Product | null = null; // Initialize as null for new products
  private initialFormValue!: any;

  constructor() {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.product = this.config.data || null; // Set product data if available
    this.patchValueForm();
    this.initialFormValue = this.myForm.value;
  }

  initializeForm(): void {
    this.myForm = this.fb.group({
      prodName: [
        "",
        [
          Validators.required,
          Validators.maxLength(50),
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
    if (this.product) {
      this.myForm.patchValue({
        prodName: this.product.name,
      });
    }
  }

  get prodName() {
    return this.myForm.get("prodName");
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

    const prodToBeAdd: Product = {
      id: this.product?.id ?? 0, // Use 0 or generate a new ID for new products
      name: this.myForm.value.prodName.trim(), // Correctly extract the form value
      addedBy: this.accountService.activeUser()?.username ?? "Unknown",
      dateAdded: new Date(),
    };

    const apiCall = this.product
      ? this.productService.update(prodToBeAdd.id!, prodToBeAdd)
      : this.productService.add(prodToBeAdd);

    apiCall.subscribe({
      next: (res) => {
        this.isSubmitting = false;

        // **Ensure product ID is available before logging**
        if (!this.product) {
          prodToBeAdd.id = res.id; // Assign the new ID from the response
        }

        this.addProductLog(prodToBeAdd); // Log after getting a valid product ID

        this.ref.close({
          status: true,
          action: this.product ? "updated" : "added",
        });
        this.myForm.reset();
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 409) {
          this.myForm.get("prodName")?.setErrors({ nameTaken: true });
        }
      },
    });
  }

  addProductLog(product: Product): void {
    const log: ProductLog = {
      action: this.product ? "Update" : "Create",
      detail: product.name,
      addedBy: this.accountService.activeUser()?.username!,
      productId: product?.id!,
    };
    this.productLogService.add(log).subscribe();
  }
}
