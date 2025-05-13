import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TransactionService } from '../../core/services/transaction/transaction.service';
import { PagedResult } from '../../core/models/page-result.model';
import { Transaction } from '../../core/models/transaction.models';
import { DatePipe, NgIf } from '@angular/common';
import { ChipModule } from 'primeng/chip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Tag } from 'primeng/tag';
import { DatePicker } from 'primeng/datepicker';
import { DialogEmailComponent } from './dialog-email/dialog-email.component';
import { DialogEmaillogsComponent } from './dialog-emaillogs/dialog-emaillogs.component';
import { TooltipModule } from 'primeng/tooltip';
import { debounceTime, lastValueFrom, Subject, Subscription } from 'rxjs';
import { SidenavService } from '../../core/services/_sidenav/sidenav.service';
import { TRANSACTION_MODE } from '../../core/constants/transaction_mode';
import { USER_TEAM } from '../../core/constants/user_team';
import { AccountService } from '../../core/services/account/account.service';
import { ExportButtonComponent } from '../../shared/components/export-button/export-button.component';

@Component({
  selector: 'app-page-email',
  standalone: true,
  imports: [
    CardModule,
    DatePicker,
    FormsModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    DatePipe,
    ChipModule,
    ButtonModule,
    ToastModule,
    ConfirmPopupModule,
    Tag,
    TooltipModule,
    NgIf,
    ExportButtonComponent,
  ],
  templateUrl: './page-email.component.html',
  styleUrl: './page-email.component.css',
  providers: [DialogService, ConfirmationService, MessageService],
})
export class PageEmailComponent implements OnInit {
  rangeDates: Date[] | undefined;
  searchString: string = '';
  searchSubject = new Subject<string>(); // Debounce Subject
  transactionService = inject(TransactionService);
  loading: boolean = true;
  pagedResult: PagedResult<Transaction> = {} as PagedResult<Transaction>;
  accountService = inject(AccountService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  dialogService = inject(DialogService);
  transaction!: Transaction;
  private readonly datePipe = new DatePipe('en-US');
  ref!: DynamicDialogRef;

  sideNavService = inject(SidenavService);
  private itemClickedSubscription!: Subscription;
  MODE = TRANSACTION_MODE;
  TEAM = USER_TEAM;

  @ViewChild('transactionTable') transactionTable!: Table;

  // Custom chip styles
  redChip = {
    colorScheme: {
      light: {
        root: {
          background: '{red.500}',
          color: '{surface.100}',
        },
      },
      dark: {
        root: {
          background: '{red.500}',
          color: '{surface.800}',
        },
      },
    },
  };
  greenChip = {
    colorScheme: {
      light: {
        root: {
          background: '{green.500}',
          color: '{surface.100}',
        },
      },
      dark: {
        root: {
          background: '{green.500}',
          color: '{surface.800}',
        },
      },
    },
  };
  blueChip = {
    colorScheme: {
      light: {
        root: {
          background: '{blue.400}',
          color: '{surface.100}',
        },
      },
      dark: {
        root: {
          background: '{blue.400}',
          color: '{surface.800}',
        },
      },
    },
  };

  ngOnInit() {
    // Debounce search input
    this.searchSubject.pipe(debounceTime(500)).subscribe((search) => {
      this.loadData({ first: 0 });
    });

    this.subscribeToSideNav();
  }

  onSearchChange() {
    this.searchSubject.next(this.searchString); // Emit search value
  }

  ngOnDestroy() {
    this.searchSubject.unsubscribe(); // Cleanup subscription

    // Unsubscribe to avoid memory leaks
    if (this.itemClickedSubscription) {
      this.itemClickedSubscription.unsubscribe();
    }
  }

  getDateFormat(team: string): string {
    return team === 'VN' ? 'dd MMM yyyy HH:mm:ss' : 'dd MMM yyyy';
  }

  getModeLabel(modeValue: number): string {
    const mode = this.MODE.find((m) => m.value === modeValue);
    return mode ? mode.label : 'Unknown';
  }

  getTeam(): string {
    return this.accountService.activeUser()?.team || '';
  }

  subscribeToSideNav() {
    this.itemClickedSubscription = this.sideNavService.itemClicked$.subscribe(
      () => {
        this.searchString = '';
        this.rangeDates = [];
        this.loadData({ first: 0 }); // Re-fetch data when the sidenav item is clicked
      }
    );
  }

  loadData($event: TableLazyLoadEvent) {
    this.loading = true;

    let fromDate: string | undefined;
    let toDate: string | undefined;

    if (this.rangeDates && this.rangeDates.length === 2) {
      // Get start of first day in local time
      const start = new Date(this.rangeDates[0]);
      start.setHours(0, 0, 0, 0);

      // Get end of last day in local time
      const end = new Date(this.rangeDates[1]);
      end.setHours(23, 59, 59, 999);

      // Convert to ISO strings (UTC)
      fromDate = start.toISOString();
      toDate = end.toISOString();
    }

    this.transactionService
      .getPaginatedList(
        $event.first ?? 0,
        'Email',
        undefined,
        fromDate,
        toDate,
        this.searchString
      )
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.pagedResult = res;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  showDialog(transaction?: Transaction): void {
    this.ref = this.dialogService.open(DialogEmailComponent, {
      data: transaction ?? null,
      header: transaction ? 'Edit Email Transaction' : 'Add Email Transaction',
      modal: true,
      width: '40vw',
      contentStyle: { minHeight: '45vh' },
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      dismissableMask: true,
      closable: true,
    });
    this.ref.onClose.subscribe((obj: any) => {
      this.transactionTable.reset();
      if (obj && obj.status === true) {
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Transaction successfully ${obj.action}.`,
            life: 3000,
          });
        }, 50);
      }
    });
  }

  showLogsDialog(transaction: Transaction): void {
    this.ref = this.dialogService.open(DialogEmaillogsComponent, {
      data: transaction ?? null,
      header: `${transaction.transactionId}`,
      modal: true,
      width: '60vw',
      contentStyle: { minHeight: '45vh' },
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      dismissableMask: true,
      closable: true,
    });
    this.ref.onClose.subscribe(() => {
      this.transactionTable.reset();
    });
  }

  confirmAndDeleteProduct(event: Event, transaction: Transaction): void {
    if (!transaction.id) return;

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this transaction?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: { label: 'Delete', severity: 'danger' },
      accept: () => {
        this.transactionService.delete(transaction.id).subscribe({
          next: () => {
            this.transactionTable.reset();
            setTimeout(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'Transaction deleted.',
                life: 3000,
              });
            }, 50);
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Something went wrong',
              life: 3000,
            });
          },
        });
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

  /**
   * Export Functions
   */

  mapTransactionRow = (t: Transaction): string[] => {
    const pickUpDate = new Date(t.pickUpDate + 'Z');
    const takeOffDate = new Date(t.takeOffDate + 'Z');

    const row: string[] = [
      t.transactionId,
      t.transactionType,
      t.repliedBy,
      t.customer,
      this.datePipe.transform(pickUpDate, 'dd MMM yyyy HH:mm') || '',
      this.datePipe.transform(takeOffDate, 'dd MMM yyyy HH:mm') || '',
      this.datePipe.transform(t.dateAdded, 'dd MMM yyyy HH:mm') || '',
      t.productName,
      t.descriptionName || '',
      t.remarks || '',
      t.status || '',
    ];

    if (this.accountService.activeUser()?.team !== 'CN') {
      row.splice(2, 0, this.getModeLabel(t.mode!));
    }

    return row;
  };

  fetchTransactions = async (fromDate?: string, toDate?: string) => {
    return await lastValueFrom(
      this.transactionService.getList(
        'Email',
        undefined,
        fromDate,
        toDate,
        this.searchString
      )
    );
  };

  exportColumns(team: string) {
    const commonColumns = [
      'Transaction ID',
      'Transaction Type',
      'Replied By',
      'Customer',
      'Pickup Date',
      'Takeoff Date',
      'Date Added',
      'Product',
      'Description',
      'Remarks',
      'Status',
    ];

    if (team === 'CN') {
      return commonColumns;
    } else {
      // Insert 'Mode' after 'Transaction Type' (index 2)
      const columnsWithMode = [...commonColumns];
      columnsWithMode.splice(2, 0, 'Mode');
      return columnsWithMode;
    }
  }
}
