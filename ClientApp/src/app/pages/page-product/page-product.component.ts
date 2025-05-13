import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { FieldsetModule } from "primeng/fieldset";
import { Table, TableLazyLoadEvent, TableModule } from "primeng/table";
import { ProductService } from "../../core/services/product/product.service";
import { Description } from "../../core/models/description.models";
import { Product } from "../../core/models/product.models";
import { NgClass, NgIf } from "@angular/common";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { ProductDialogComponent } from "./product-dialog/product-dialog.component";
import { DescriptionService } from "../../core/services/description/description.service";
import { PagedResult } from "../../core/models/page-result.model";
import { BadgeModule } from "primeng/badge";
import { ToastModule } from "primeng/toast";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { ConfirmationService, MessageService } from "primeng/api";
import { DescriptionDialogComponent } from "./description-dialog/description-dialog.component";
import { ProductLogsComponent } from "./product-logs/product-logs.component";
import { DescriptionLogsComponent } from "./description-logs/description-logs.component";
import { ProductLogService } from "../../core/services/product-log/product-log.service";
import { DescriptionLogService } from "../../core/services/description-log/description-log.service";
import { ProductLog } from "../../core/models/product-log.models";
import { AccountService } from "../../core/services/account/account.service";
import { TooltipModule } from "primeng/tooltip";
import { MessageModule } from "primeng/message";
import { ChipModule } from "primeng/chip";
import { SidenavService } from "../../core/services/_sidenav/sidenav.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-page-product",
  standalone: true,
  imports: [
    CardModule,
    FieldsetModule,
    ButtonModule,
    TableModule,
    NgClass,
    NgIf,
    BadgeModule,
    ToastModule,
    ConfirmPopupModule,
    TooltipModule,
    MessageModule,
    ChipModule,
  ],
  templateUrl: "./page-product.component.html",
  styleUrl: "./page-product.component.css",
  providers: [DialogService, ConfirmationService, MessageService],
})
export class PageProductComponent implements OnInit {
  accountService = inject(AccountService);
  productService = inject(ProductService);
  productLogService = inject(ProductLogService);
  descriptionService = inject(DescriptionService);
  descriptionLogService = inject(DescriptionLogService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  dialogService = inject(DialogService);

  @ViewChild("productTable") productTable!: Table;
  @ViewChild("descriptionTable") descriptionTable!: Table;

  selectedProduct: Product | null = null;
  prodPageResult: PagedResult<Product> = {} as PagedResult<Product>;
  prodLoading = true;

  descPageResult: PagedResult<Description> = {} as PagedResult<Description>;
  descLoading = true;
  selectedDescription: Description | null = null;

  productCount: number = 0;
  descriptionCount: number = 0;

  ref: DynamicDialogRef | undefined;
  isInitialLoad = true;

  sideNavService = inject(SidenavService);
  private itemClickedSubscription!: Subscription;

  ngOnInit(): void {
    this.subscribeToSideNav();
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    if (this.itemClickedSubscription) {
      this.itemClickedSubscription.unsubscribe();
    }
  }

  subscribeToSideNav() {
    this.itemClickedSubscription = this.sideNavService.itemClicked$.subscribe(
      () => {
        this.loadProducts({ first: 0 });
        this.selectedProduct = null;
      }
    );
  }

  /**
   *
   * PRODUCT METHODS
   *
   */

  loadProducts($event: TableLazyLoadEvent): void {
    this.prodLoading = true;
    this.productService.getAll($event.first ?? 0, 10, false, false).subscribe({
      next: (res) => {
        this.prodLoading = false;
        this.prodPageResult = res;
        this.productCount = this.prodPageResult.totalCount;
      },
      error: () => (this.prodLoading = false),
    });
  }

  onProductSelect(product: Product): void {
    this.selectedProduct = product;
    this.isInitialLoad = true;
    this.loadDescriptions({ first: 0 });
  }

  showProductLogs(product: Product): void {
    this.ref = this.dialogService.open(ProductLogsComponent, {
      data: product || null,
      header: "Product Logs",
      modal: true,
      width: "60vw",
      contentStyle: { minHeight: "45vh" },
      breakpoints: { "960px": "75vw", "640px": "90vw" },
      dismissableMask: true,
      closable: true,
    });
  }

  showProductDialog(product?: Product): void {
    this.ref = this.dialogService.open(ProductDialogComponent, {
      data: product || null,
      header: product ? "Edit Product" : "Add Product",
      modal: true,
      width: "25vw",
      breakpoints: { "960px": "75vw", "640px": "90vw" },
      dismissableMask: true,
      closable: true,
    });

    this.ref.onClose.subscribe((obj: any) => {
      this.productTable.reset();
      if (obj.status === true) {
        setTimeout(() => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: `Product successfully ${obj.action}.`,
            life: 3000,
          });
        }, 50);
      } else {
        setTimeout(() => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: `Something went wrong. Please try again.`,
            life: 3000,
          });
        }, 50);
      }
    });
  }

  confirmAndDeleteProduct(event: Event, product: Product): void {
    if (!product.id) return;

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Do you want to delete this product?",
      icon: "pi pi-info-circle",
      rejectButtonProps: {
        label: "Cancel",
        severity: "secondary",
        outlined: true,
      },
      acceptButtonProps: { label: "Delete", severity: "danger" },
      accept: () => {
        this.addProductLog();
        this.productService.delete(product.id!).subscribe({
          next: () => {
            this.productTable.reset();
            this.descriptionTable.reset();
            setTimeout(() => {
              this.messageService.add({
                severity: "success",
                summary: "Deleted",
                detail: "Product deleted.",
                life: 3000,
              });
            }, 50);
          },
          error: () => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Something went wrong. Please try again.",
              life: 3000,
            });
          },
        });
      },
    });
  }

  addProductLog(): void {
    const log: ProductLog = {
      action: "Delete",
      detail: "Product deleted.",
      addedBy: this.accountService.activeUser()?.username!,
      productId: this.selectedProduct?.id!,
    };
    this.productLogService.add(log).subscribe();
  }
  /**
   *
   * DESCRIPTION METHODS
   *
   */
  onDescriptionSelect(description: Description): void {
    this.selectedDescription = description;
  }

  loadDescriptions($event: TableLazyLoadEvent): void {
    if (!this.selectedProduct) return;
    this.descLoading = true;
    this.descriptionService
      .getAll($event.first ?? 0, 10, this.selectedProduct.id ?? 0)
      .subscribe({
        next: (res) => {
          this.descLoading = false;
          this.descPageResult = res;
          this.isInitialLoad = false;
          this.descriptionCount = res.totalCount;
        },
        error: () => (this.descLoading = false),
      });
  }

  showDescriptionLogs(description: Description): void {
    this.ref = this.dialogService.open(DescriptionLogsComponent, {
      data: description || null,
      header: "Description Logs",
      modal: true,
      width: "60vw",
      contentStyle: { minHeight: "45vh" },
      breakpoints: { "960px": "75vw", "640px": "90vw" },
      dismissableMask: true,
      closable: true,
    });
  }

  showDescriptionDialog(product: Product, description?: Description): void {
    this.ref = this.dialogService.open(DescriptionDialogComponent, {
      data: {
        product: product,
        description: description || null,
      },
      header: description ? "Edit Description" : "Add Description",
      modal: true,
      width: "25vw",

      breakpoints: { "960px": "75vw", "640px": "90vw" },
      dismissableMask: true,
      closable: true,
    });

    this.ref.onClose.subscribe((obj: any) => {
      this.descriptionTable.reset();
      if (obj.status === true) {
        setTimeout(() => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: `Description successfully ${obj.action}.`,
            life: 3000,
          });
        }, 50);
      }
    });
  }

  confirmAndDeleteDescription(event: Event, description: Description): void {
    if (!description.id) return;

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Do you want to delete this description?",
      icon: "pi pi-info-circle",
      rejectButtonProps: {
        label: "Cancel",
        severity: "secondary",
        outlined: true,
      },
      acceptButtonProps: { label: "Delete", severity: "danger" },
      accept: () => {
        this.descriptionService.delete(description.id!).subscribe({
          next: () => {
            this.descriptionTable.reset();
            setTimeout(() => {
              this.messageService.add({
                severity: "success",
                summary: "Deleted",
                detail: "Description deleted.",
                life: 3000,
              });
            }, 50);
          },
          error: () => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Something went wrong",
              life: 3000,
            });
          },
        });
      },
    });
  }
}

/**
 * loadProducts: Fetches the list of products and updates the table.
 * loadDescriptions: Fetches descriptions of the selected product.
 * onProductSelect: Sets the selected product and loads its descriptions.
 * onDescriptionSelect: Sets the selected description.
 * showProductDialog: Opens the dialog for adding or editing a product.
 * showDescriptionDialog: Opens the dialog for adding or editing a description.
 * confirmAndDeleteProduct: Displays a confirmation popup before deleting a product.
 * confirmAndDeleteDescription: Displays a confirmation popup before deleting a description.
 */
