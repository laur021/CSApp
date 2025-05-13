import { Component, inject, OnInit } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { TableLazyLoadEvent, TableModule } from "primeng/table";
import { ProductLogService } from "../../../core/services/product-log/product-log.service";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ProductLog } from "../../../core/models/product-log.models";
import { PagedResult } from "../../../core/models/page-result.model";
import { Product } from "../../../core/models/product.models";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-product-logs",
  standalone: true,
  imports: [TableModule, ButtonModule, DatePipe],
  templateUrl: "./product-logs.component.html",
  styleUrl: "./product-logs.component.css",
})
export class ProductLogsComponent implements OnInit {
  productLogService = inject(ProductLogService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig<ProductLog>); // Inject to receive data from parent
  data: PagedResult<ProductLog> = {} as PagedResult<ProductLog>;
  product!: Product;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.product = this.config.data || null; // Set product data if available
  }

  getLogs($event: TableLazyLoadEvent): void {
    this.isLoading = true;
    this.productLogService.get(this.product.id!, $event.first ?? 0).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.data = res;
      },
      error: () => (this.isLoading = false),
    });
  }
}
