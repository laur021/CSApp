import { Component, inject } from "@angular/core";
import { TransactionLogService } from "../../../core/services/transaction-log/transaction-log.service";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TransactionLog } from "../../../core/models/transaction-log.model";
import { PagedResult } from "../../../core/models/page-result.model";
import { TableLazyLoadEvent, TableModule } from "primeng/table";
import { Transaction } from "../../../core/models/transaction.models";
import { DatePipe, NgFor } from "@angular/common";
import { textToTextArray } from "../../../core/functions/textToTextArray";
import { TooltipModule } from "primeng/tooltip";
import { ChipModule } from "primeng/chip";

@Component({
  selector: "app-dialog-emaillogs",
  standalone: true,
  imports: [TableModule, DatePipe, TooltipModule, NgFor, ChipModule],
  templateUrl: "./dialog-emaillogs.component.html",
  styleUrl: "./dialog-emaillogs.component.css",
})
export class DialogEmaillogsComponent {
  transactionlogService = inject(TransactionLogService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig<TransactionLog>); // Inject to receive data from parent
  data: PagedResult<TransactionLog> = {} as PagedResult<TransactionLog>;
  transaction!: Transaction;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.transaction = this.config.data || null; // Set product data if available
  }

  getLogs($event: TableLazyLoadEvent): void {
    this.isLoading = true;
    this.transactionlogService
      .get(this.transaction.transactionId, $event.first ?? 0)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.data = res;
        },
        error: () => (this.isLoading = false),
      });
  }

  formatDetails(detail: string) {
    return textToTextArray(detail);
  }
}
