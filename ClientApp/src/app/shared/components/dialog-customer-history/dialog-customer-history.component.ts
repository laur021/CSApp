import { Component, inject } from '@angular/core';
import { TransactionService } from '../../../core/services/transaction/transaction.service';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Transaction } from '../../../core/models/transaction.models';
import { PagedResult } from '../../../core/models/page-result.model';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { DatePipe, NgIf } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { AccountService } from '../../../core/services/account/account.service';
import { USER_TEAM } from '../../../core/constants/user_team';
import { TRANSACTION_MODE } from '../../../core/constants/transaction_mode';

@Component({
  selector: 'app-dialog-customer-history',
  standalone: true,
  imports: [TableModule, DatePipe, TagModule, TooltipModule, NgIf],
  templateUrl: './dialog-customer-history.component.html',
  styleUrl: './dialog-customer-history.component.css',
  providers: [DialogService],
})
export class DialogCustomerHistoryComponent {
  transactionService = inject(TransactionService);
  accountService = inject(AccountService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig<Transaction>); // Inject to receive data from parent
  data: PagedResult<Transaction> = {} as PagedResult<Transaction>;
  customerName!: string;
  isLoading: boolean = true;
  TEAM = USER_TEAM;
  MODE = TRANSACTION_MODE;

  ngOnInit(): void {
    this.customerName = this.config.data || null; // Set product data if available
  }

  getLogs($event: TableLazyLoadEvent): void {
    this.isLoading = true;
    this.transactionService
      .getPaginatedList($event.first ?? 0, undefined, this.customerName)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.data = res;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Closed':
        return 'danger';

      case 'Processing':
        return 'success';

      case 'Pending':
        return 'info';

      default:
        return 'secondary';
    }
  }

  getTeam(): string {
    return this.accountService.activeUser()?.team || '';
  }

  getModeLabel(modeValue: number): string {
    const mode = this.MODE.find((m) => m.value === modeValue);
    return mode ? mode.label : 'Unknown';
  }

  getDateFormat(team: string): string {
    return team === 'VN' ? 'dd MMM yyyy HH:mm:ss' : 'dd MMM yyyy';
  }
}
