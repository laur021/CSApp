import { Component, inject } from "@angular/core";
import { TransactionLogService } from "../../../core/services/transaction-log/transaction-log.service";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TransactionLog } from "../../../core/models/transaction-log.model";
import { PagedResult } from "../../../core/models/page-result.model";
import { TableLazyLoadEvent, TableModule } from "primeng/table";
import { Transaction } from "../../../core/models/transaction.models";
import { DatePipe, NgFor } from "@angular/common";
import { TooltipModule } from "primeng/tooltip";
import { textToTextArray } from "../../../core/functions/textToTextArray";

@Component({
  selector: "app-dialog-phonelogs",
  standalone: true,
  imports: [TableModule, DatePipe, TooltipModule, NgFor],
  templateUrl: "./dialog-phonelogs.component.html",
  styleUrl: "./dialog-phonelogs.component.css",
})
export class DialogPhonelogsComponent {
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
    return textToTextArray(detail)
  }

}
