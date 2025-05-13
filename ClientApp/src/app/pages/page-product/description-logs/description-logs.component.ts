import { Component, inject } from "@angular/core";
import { DescriptionLogService } from "../../../core/services/description-log/description-log.service";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { DescriptionLog } from "../../../core/models/description-log.model";
import { PagedResult } from "../../../core/models/page-result.model";
import { Description } from "../../../core/models/description.models";
import { TableLazyLoadEvent, TableModule } from "primeng/table";
import { DatePipe } from "@angular/common";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-description-logs",
  standalone: true,
  imports: [TableModule, DatePipe, TooltipModule],
  templateUrl: "./description-logs.component.html",
  styleUrl: "./description-logs.component.css",
})
export class DescriptionLogsComponent {
  descriptionLogService = inject(DescriptionLogService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig<DescriptionLog>); // Inject to receive data from parent
  data: PagedResult<DescriptionLog> = {} as PagedResult<DescriptionLog>;
  product!: Description;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.product = this.config.data || null; // Set product data if available
  }

  getLogs($event: TableLazyLoadEvent): void {
    this.isLoading = true;
    this.descriptionLogService
      .get(this.product.id!, $event.first ?? 0)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.data = res;
        },
        error: () => (this.isLoading = false),
      });
  }
}
