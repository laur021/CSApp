import {
  ChangeDetectorRef,
  Component,
  inject,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { Select, SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TransactionWrite } from '../../../core/models/transaction.models';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ProductService } from '../../../core/services/product/product.service';
import { Product } from '../../../core/models/product.models';
import { DescriptionService } from '../../../core/services/description/description.service';
import { Tag } from 'primeng/tag';
import { AccountService } from '../../../core/services/account/account.service';
import { DatePipe, NgIf } from '@angular/common';
import { TRANSACTION_STATUS } from '../../../core/constants/transaction_status';
import { generateTransactionId } from '../../../core/functions/generateID';
import { TransactionService } from '../../../core/services/transaction/transaction.service';
import { Description } from '../../../core/models/description.models';
import { Subject, takeUntil } from 'rxjs';
import { MessageModule } from 'primeng/message';
import { formatDate } from '../../../core/functions/formatDate';
import { TransactionLogService } from '../../../core/services/transaction-log/transaction-log.service';
import { TransactionLog } from '../../../core/models/transaction-log.model';
import { DialogCustomerHistoryComponent } from '../../../shared/components/dialog-customer-history/dialog-customer-history.component';
import { TooltipModule } from 'primeng/tooltip';
import { SelectButton } from 'primeng/selectbutton';
import { TRANSACTION_MODE } from '../../../core/constants/transaction_mode';

@Component({
  selector: 'app-dialog-phone',
  standalone: true,
  imports: [
    FormsModule,
    SelectModule,
    TextareaModule,
    DatePickerModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    Tag,
    NgIf,
    MessageModule,
    TooltipModule,
    SelectButton,
  ],
  templateUrl: './dialog-phone.component.html',
  styleUrl: './dialog-phone.component.css',
  providers: [DatePipe],
})
export class DialogPhoneComponent {
  private readonly destroy$ = new Subject<void>();
  isSubmitting = false;
  private readonly fb = inject(FormBuilder);
  datePipe = inject(DatePipe);
  cdr = inject(ChangeDetectorRef);
  ref = inject(DynamicDialogRef);
  customerLogRef = inject(DynamicDialogRef);
  dialogService = inject(DialogService);
  productService = inject(ProductService);
  descriptionService = inject(DescriptionService);
  accountService = inject(AccountService);
  config = inject(DynamicDialogConfig<Product>); // Inject to receive data from parent
  transactionService = inject(TransactionService);
  transactionLogService = inject(TransactionLogService);
  transaction: any = this.config.data || null;
  products: any;
  descriptions: any;
  selectedDescription: Description | null = null;
  usersList: any;
  STATUS = Object.values(TRANSACTION_STATUS).map((status) => ({
    status: status,
  }));
  MODE: any[] = TRANSACTION_MODE;

  myForm: FormGroup;

  @ViewChild('productSelect') productSelect!: Select;
  @ViewChild('descriptionSelect') descriptionSelect!: Select;

  constructor() {
    this.myForm = this.fb.group(
      {
        id: [0],
        transactionId: [{ value: 'sample', disabled: true }],
        transactionType: [''],
        mode: [1],
        customer: ['', Validators.required],
        pickUpDate: [new Date(), Validators.required],
        takeOffDate: [new Date(), Validators.required],
        duration: [0],
        productName: [null, Validators.required],
        descriptionName: [
          null,
          [Validators.required, this.validateDescriptionExists()],
        ], // Add custom validator here
        remarks: ['', Validators.maxLength(250)],
        repliedBy: [
          { value: null, disabled: !this.transaction },
          Validators.required,
        ],
        status: ['', Validators.required],
        addedBy: [''],
        dateAdded: [new Date()],
      },
      { validators: this.validateDates() }
    );
  }

  // ngAfterViewInit() {
  //   if (this.transaction) {
  //     this.cdr.detectChanges(); // Force Angular to check for changes
  //     this.dropdownShow();
  //   }
  // }

  ngOnInit(): void {
    this.transaction = this.config.data || null;
    this.loadProducts();
    this.loadDescriptions();
    this.loadUserList();

    // Subscribe to mode changes
    this.myForm
      .get('mode')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((mode) => {
        this.handleModeChange(mode);
      });

    if (this.transaction) {
      this.myForm.patchValue({
        transactionId: this.transaction.transactionId,
        mode: this.transaction.mode,
        customer: this.transaction.customer,
        pickUpDate: new Date(this.transaction.pickUpDate + 'Z'),
        takeOffDate: new Date(this.transaction.takeOffDate + 'Z'),
        duration: this.transaction.duration,
        // extra lang yugn productName at descriptionName to avoid error
        productName: this.transaction.productName,
        descriptionName: this.transaction.descriptionName,
        remarks: this.transaction.remarks,
        repliedBy: this.transaction.repliedBy,
        status: this.transaction.status,
        addedBy: this.transaction.addedBy,
        dateAdded: this.transaction.dateAdded,
      });
      this.calculateDuration(); // Calculate duration for existing transaction
    } else {
      this.myForm.reset({
        ...this.transaction,
        transactionId: generateTransactionId('phone'),
        mode: 1,
        pickUpDate: new Date(),
        takeOffDate: new Date(),
        repliedBy: this.accountService.activeUser()?.username,
        status: this.STATUS[2],
      });
      this.calculateDuration(); // Calculate duration for existing transaction
    }

    // Subscribe to changes in pickUpDate and takeOffDate
    this.myForm
      .get('pickUpDate')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculateDuration());

    this.myForm
      .get('takeOffDate')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculateDuration());
  }

  handleModeChange(mode: number): void {
    const pickUpDateControl = this.myForm.get('pickUpDate');
    const takeOffDateControl = this.myForm.get('takeOffDate');

    // If mode is "Outbound" (assuming mode=2 is Outbound)
    if (mode === 2) {
      // Disable Pick-Up Date and clear its value
      pickUpDateControl?.disable();
      pickUpDateControl?.setValue(null);

      // Set Pick-Up Date = Take-Off Date when Take-Off Date changes
      takeOffDateControl?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((takeOffDate) => {
          pickUpDateControl?.setValue(takeOffDate);
        });
    } else {
      // Re-enable Pick-Up Date if mode is not Outbound
      pickUpDateControl?.enable();
      pickUpDateControl?.setValue(new Date()); // Or default value
    }
  }

  onSubmit(): void {
    if (this.myForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    // Get raw form values including disabled fields
    const formValue = this.myForm.getRawValue();

    // Prepare the data object
    const data: TransactionWrite = {
      transactionId: formValue.transactionId,
      transactionType: 'Phone',
      mode: formValue.mode,
      customer: formValue.customer,
      // Use TakeOffDate for PickUpDate when mode is Outbound (2)
      pickUpDate:
        formValue.mode === 2 ? formValue.takeOffDate : formValue.pickUpDate,
      takeOffDate: formValue.takeOffDate,
      duration: formValue.duration,
      remarks: formValue.remarks,
      repliedBy: formValue.repliedBy,
      status: this.transaction ? formValue.status : formValue.status?.status, // Access the status prop because it's an object during insert
      addedBy: this.transaction
        ? formValue.addedBy
        : this.accountService.activeUser()?.username,
      dateAdded: this.transaction ? formValue.dateAdded : new Date(),
      descriptionId: this.selectedDescription?.id!,
    };

    this.calculateDuration();

    const apiCall = this.transaction
      ? this.transactionService.update(data.transactionId, data)
      : this.transactionService.add(data);

    apiCall.subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.ref.close({
          status: true,
          action: this.transaction ? 'updated' : 'added',
        });
        this.logTransaction(data);
      },
      error: (_) => {
        this.isSubmitting = false;
      },
    });
  }

  loadProducts() {
    this.productService.getAll(undefined, 2147483647).subscribe({
      next: (res) => {
        this.products = res.items.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );

        // to filter the description during initialize load of edit.
        if (this.transaction) {
          const selectedProduct = this.products?.find(
            (p: any) => p.name === this.transaction.productName
          );

          if (!selectedProduct) {
            // Reset the productName field if no selected product
            // It is for the case that the product is deleted
            this.myForm.get('productName')?.reset();
            return;
          }

          this.loadDescriptions(selectedProduct.id);
        }
      },
    });
  }

  loadDescriptions(id?: number) {
    this.myForm.get('descriptionName')?.setErrors(null); //need to reset the errors kasi nakahide parin yung panel dahil sa [panelStyle] attrb
    this.descriptionService.getAll(undefined, 2147483647, id).subscribe({
      next: (res) => {
        this.descriptions = res.items.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );

        // If in edit mode, set the selected description based on transaction data
        if (this.transaction) {
          this.selectedDescription = this.descriptions.find(
            (desc: any) => desc.name === this.transaction.descriptionName
          );
        }

        if (!this.selectedDescription) {
          // Reset the description field if no match
          this.myForm.get('descriptionName')?.reset();
        }
      },
    });
  }

  onProductChange($event: any) {
    let selectedItem = $event.value;
    // If selectedProduct is just a name, find the specific object from Products
    // It happens during edit mode because the optionValue attr is defined
    if (typeof selectedItem === 'string') {
      selectedItem = this.products.find((p: any) => p.name === selectedItem);
      this.loadDescriptions(selectedItem.id);
    } else {
      this.loadDescriptions(selectedItem);
    }

    // Reset the description field and mark it as invalid
    this.myForm.get('descriptionName')?.reset();
    this.myForm.get('descriptionName')?.markAsTouched();
    this.myForm.get('descriptionName')?.updateValueAndValidity();
  }

  onDescriptionChange($event?: any): void {
    const selectedDesc = $event?.value;

    if (!selectedDesc) {
      // If description is cleared, reset the field and set validation errors
      const descControl = this.myForm.get('descriptionName');
      descControl?.reset();
      descControl?.setErrors({ required: true });
      descControl?.markAsTouched();
      descControl?.updateValueAndValidity();

      this.selectedDescription = null;
      return;
    }

    // If a valid description is selected, store it
    this.selectedDescription = this.descriptions.find((desc: any) =>
      typeof selectedDesc === 'string'
        ? desc.name === selectedDesc
        : desc.id === selectedDesc
    );

    if (!this.selectedDescription) return;

    const selectedProd = this.products.find(
      (p: any) => p.id === this.selectedDescription?.productId
    );

    if (!selectedProd) return;

    // Ensure we set the correct value type based on `transaction`
    const valueToSet = this.transaction ? selectedProd.name : selectedProd.id;
    this.myForm.get('productName')?.setValue(valueToSet);
  }

  loadUserList() {
    this.accountService.getAll(undefined, 2147483647).subscribe({
      next: (res) => {
        this.usersList = res.items;
      },
    });
  }

  calculateDuration(): void {
    const pickUpDate = this.myForm.get('pickUpDate')?.value;
    const takeOffDate = this.myForm.get('takeOffDate')?.value;

    if (pickUpDate && takeOffDate) {
      const adjustedPickUpDate = new Date(pickUpDate);
      const adjustedTakeOffDate = new Date(takeOffDate);

      // Ensure takeOffDate is not earlier than pickUpDate
      if (adjustedTakeOffDate < adjustedPickUpDate) {
        adjustedTakeOffDate.setTime(adjustedPickUpDate.getTime());
      }

      const duration = Math.max(
        0,
        Math.ceil(
          (adjustedTakeOffDate.getTime() - adjustedPickUpDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      );

      this.myForm.get('duration')?.setValue(duration);
    }
  }

  validateDates(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const pickUpDate = group.get('pickUpDate')?.value;
      const takeOffDate = group.get('takeOffDate')?.value;

      if (pickUpDate && takeOffDate && takeOffDate < pickUpDate) {
        return { takeOffBeforePickUp: true };
      }
      return null;
    };
  }
  validateDescriptionExists(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return { required: true };
      }
      const isValid = this.descriptions?.some(
        (desc: any) => desc.name === control.value || desc.id === control.value
      );
      return isValid ? null : { invalidDescription: true };
    };
  }

  getDateFormat(team: string | undefined): string {
    return team === 'VN' ? 'dd MMM yyyy HH:mm:ss' : 'dd MMM yyyy';
  }

  logTransaction(data: TransactionWrite): void {
    let logDetails = '';
    const currentUser = this.accountService.activeUser()?.username;
    const currentTeam = this.accountService.activeUser()?.team;

    if (!this.transaction) {
      // If adding a new transaction
      logDetails = `Created by ${currentUser}`;
    } else {
      // If editing an existing transaction, detect changes
      const changes: string[] = [];
      const oldModeLabel = this.MODE.find(
        (x) => x.value === this.transaction.mode
      )?.label;
      const newModeLabel = this.MODE.find((x) => x.value === data.mode)?.label;

      if (data.mode !== this.transaction.mode) {
        changes.push(`Mode: ${oldModeLabel} to ${newModeLabel}`);
      }

      if (data.customer !== this.transaction.customer) {
        changes.push(
          `Customer: ${this.transaction.customer} to ${data.customer}`
        );
      }
      const oldPickUpDate = new Date(this.transaction.pickUpDate + 'Z'); //converted to local timezone
      const newPickUpDate = new Date(data.pickUpDate); //already converted during onInit

      if (oldPickUpDate.getTime() !== newPickUpDate.getTime()) {
        //to accurately compare the value
        changes.push(
          `Pick-up Date: ${this.datePipe.transform(
            oldPickUpDate,
            this.getDateFormat(currentTeam)
          )} to ${this.datePipe.transform(
            newPickUpDate,
            this.getDateFormat(currentTeam)
          )}`
        );
      }

      const oldTakeOffDate = new Date(this.transaction.takeOffDate + 'Z');
      const newTakeOffDate = new Date(data.takeOffDate);

      if (oldTakeOffDate.getTime() !== newTakeOffDate.getTime()) {
        //to accurately compare the value
        changes.push(
          `Pick-up Date: ${this.datePipe.transform(
            oldTakeOffDate,
            this.getDateFormat(currentTeam)
          )} to ${this.datePipe.transform(
            newTakeOffDate,
            this.getDateFormat(currentTeam)
          )}`
        );
      }

      if (
        this.myForm.get('productName')?.value !== this.transaction.productName
      ) {
        changes.push(
          `Product: ${this.transaction.productName} to ${
            this.myForm.get('productName')?.value
          }`
        );
      }
      if (
        this.myForm.get('descriptionName')?.value !==
        this.transaction.descriptionName
      ) {
        changes.push(
          `Description: ${this.transaction.descriptionName} to ${
            this.myForm.get('descriptionName')?.value
          }`
        );
      }
      if (data.repliedBy !== this.transaction.repliedBy) {
        changes.push(
          `Replied By: ${this.transaction.repliedBy} to ${data.repliedBy}`
        );
      }
      if (data.remarks !== this.transaction.remarks) {
        changes.push(`Remarks: ${this.transaction.remarks} to ${data.remarks}`);
      }
      if (data.status !== this.transaction.status) {
        changes.push(`Status: ${this.transaction.status} to ${data.status}`);
      }

      logDetails =
        changes.length > 0 ? `${changes.join(' | ')}` : `No changes were made.`;
    }

    const logEntry: TransactionLog = {
      action: this.transaction ? 'Update' : 'Create',
      detail: logDetails,
      addedBy: currentUser!,
      dateAdded: formatDate(new Date()),
      transactionId: data.transactionId,
    };

    this.transactionLogService.add(logEntry).subscribe();
  }

  showCustomerLogs(): void {
    this.customerLogRef = this.dialogService.open(
      DialogCustomerHistoryComponent,
      {
        data: this.myForm.get('customer')?.value,
        header: 'Customer History',
        modal: true,
        width: '70vw',
        contentStyle: { minHeight: '45vh' },
        breakpoints: { '960px': '75vw', '640px': '90vw' },
        dismissableMask: true,
        closable: true,
      }
    );
  }

  openDropdown(event: any) {
    if (event.srcElement.type == 'text') {
      if (this.descriptionSelect) {
        this.descriptionSelect.show(); // Open the dropdown on focus
      }
    }
  }
}
