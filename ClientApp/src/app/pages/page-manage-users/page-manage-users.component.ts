import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AccountService } from '../../core/services/account/account.service';
import { Account } from '../../core/models/account.models';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ROLE } from '../../core/constants/role';
import { USER_STATUS } from '../../core/constants/user_status';
import { PagedResult } from '../../core/models/page-result.model';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { SidenavService } from '../../core/services/_sidenav/sidenav.service';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-page-manage-users',
  standalone: true,
  imports: [
    CardModule,
    TableModule,
    DatePipe,
    ButtonModule,
    DialogModule,
    ChipModule,
    InputTextModule,
    PasswordModule,
    IftaLabelModule,
    ReactiveFormsModule,
    FormsModule,
    InputIconModule,
    IconFieldModule,
    ToastModule,
    TagModule,
  ],
  templateUrl: './page-manage-users.component.html',
  styleUrl: './page-manage-users.component.css',
  providers: [DialogService, MessageService],
})
export class PageManageUsersComponent implements OnInit {
  searchQuery = '';
  accountService = inject(AccountService);
  pagedResult: PagedResult<Account> = {} as PagedResult<Account>;
  ref: DynamicDialogRef | undefined;
  private readonly messageService = inject(MessageService);
  dialogService = inject(DialogService);
  loading: boolean = true;

  ROLE = Object.values(ROLE).map((role) => ({ role: role })); //convert constants into array
  STATUS = Object.values(USER_STATUS).map((status) => ({ status: status }));
  @ViewChild('userTable') userTable!: Table;
  searchSubject = new Subject<string>(); // Debounce Subject

  sideNavService = inject(SidenavService);
  private itemClickedSubscription!: Subscription;

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
  grayChip = {
    colorScheme: {
      light: {
        root: {
          background: '{zinc.500}',
          color: '{surface.100}',
        },
      },
      dark: {
        root: {
          background: '{zinc.500}',
          color: '{surface.800}',
        },
      },
    },
  };

  ngOnInit(): void {
    // Debounce search input
    this.searchSubject.pipe(debounceTime(500)).subscribe((search) => {
      this.loadAccounts({ first: 0 });
    });

    this.subscribeToSideNav();
  }

  onSearchChange() {
    this.searchSubject.next(this.searchQuery); // Emit search value
  }

  ngOnDestroy() {
    this.searchSubject.unsubscribe(); // Cleanup subscription

    // Unsubscribe to avoid memory leaks
    if (this.itemClickedSubscription) {
      this.itemClickedSubscription.unsubscribe();
    }
  }

  subscribeToSideNav() {
    this.itemClickedSubscription = this.sideNavService.itemClicked$.subscribe(
      () => {
        this.searchQuery = '';
        this.loadAccounts({ first: 0 }); // Re-fetch data when the sidenav item is clicked
      }
    );
  }

  //no need to include in ngOninit, it is activated in onlazyload in p-table
  // loadAccounts($event: TableLazyLoadEvent, search?: string) {
  loadAccounts($event: TableLazyLoadEvent) {
    this.loading = true;
    this.accountService
      .getAll($event.first ?? 0, 10, this.searchQuery)
      .subscribe((res) => {
        this.loading = false;
        this.pagedResult = res;
      });
  }

  showDialog(user?: Account): void {
    this.ref = this.dialogService.open(DialogUserComponent, {
      data: user ?? null,
      header: user ? 'Edit User' : 'Add User',
      modal: true,
      width: '35rem',
      contentStyle: { overflow: 'hidden' },
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      dismissableMask: true,
      closable: true,
    });
    this.ref.onClose.subscribe((obj: any) => {
      this.userTable.reset();
      if (obj.status === true) {
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Account successfully ${obj.action}`,
            life: 3000,
          });
        }, 50);
      } else {
        setTimeout(() => {
          this.messageService.add({
            severity: 'Error',
            summary: 'Error',
            detail: `Something went wrong. Please try again.`,
            life: 3000,
          });
        }, 50);
      }
    });
  }
  getSeverity(status: string) {
    switch (status) {
      case 'Closed':
        return 'danger';

      case 'Active':
        return 'success';

      case 'Inactive':
        return 'secondary';

      default:
        return 'secondary';
    }
  }
}
