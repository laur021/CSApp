import { Component, inject, OnInit } from "@angular/core";
import { CardModule } from "primeng/card";
import { ActivityLogService } from "../../core/services/activity-log/activity-log.service";
import { TableLazyLoadEvent, TableModule } from "primeng/table";
import { DatePipe } from "@angular/common";
import { PagedResult } from "../../core/models/page-result.model";
import { Activitylog } from "../../core/models/activity-log.models";
import { SidenavService } from "../../core/services/_sidenav/sidenav.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-page-activity-log",
  standalone: true,
  imports: [CardModule, TableModule, DatePipe],
  templateUrl: "./page-activity-log.component.html",
  styleUrl: "./page-activity-log.component.css",
})
export class PageActivityLogComponent implements OnInit {
  activityLogService = inject(ActivityLogService);
  pagedResult: PagedResult<Activitylog> = {} as PagedResult<Activitylog>;
  loading: boolean = true;

  sideNavService = inject(SidenavService);
  private itemClickedSubscription!: Subscription;

  customDt = {
    headerCell: {
      padding: "1rem",
    },
    bodyCell: {
      padding: "1rem",
    },
  };

  ngOnInit(): void {
    this.activityLogService.getAll();

    this.subscribeToSideNav();
  }

  LoadLogs($event: TableLazyLoadEvent) {
    this.loading = true;

    this.activityLogService.getAll($event.first ?? 0).subscribe((res) => {
      this.loading = false;
      this.pagedResult = res;
    });
  }

  subscribeToSideNav() {
    this.itemClickedSubscription = this.sideNavService.itemClicked$.subscribe(
      () => {
        this.LoadLogs({ first: 0 }); // Re-fetch data when the sidenav item is clicked
      }
    );
  }
}
