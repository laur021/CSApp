import { ChangeDetectorRef, Component, inject, ViewChild } from "@angular/core";
import { DrawerModule, Drawer } from "primeng/drawer";
import { ButtonModule } from "primeng/button";
import { Ripple } from "primeng/ripple";
import { AvatarModule } from "primeng/avatar";

import { ThemeService } from "../../../core/services/_theme/theme.service";
import { CommonModule, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AccountService } from "../../../core/services/account/account.service";
import { VERSION } from "../../../core/constants/version";
import { Activitylog } from "../../../core/models/activity-log.models";
import { ActivityLogService } from "../../../core/services/activity-log/activity-log.service";
import { SidenavService } from "../../../core/services/_sidenav/sidenav.service";
import { Router, RouterOutlet } from "@angular/router";
import { ROLE } from "../../../core/constants/role";
import { getPCName } from "../../../core/functions/getPCName";
import { TooltipModule } from "primeng/tooltip";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: "app-sidenav",
  standalone: true,
  imports: [
    DrawerModule,
    ButtonModule,
    Ripple,
    AvatarModule,
    CommonModule,
    FormsModule,
    RouterOutlet,
    TooltipModule,
    NgIf,
    FooterComponent,
  ],
  templateUrl: "./sidenav.component.html",
  styleUrl: "./sidenav.component.css",
})
export class SidenavComponent {
  @ViewChild("drawerRef") drawerRef!: Drawer;

  themeService = inject(ThemeService);
  accountService = inject(AccountService);
  activityLogService = inject(ActivityLogService);
  sideNavService = inject(SidenavService);
  router = inject(Router);
  checked: boolean = this.themeService.isDarkTheme;
  visible: boolean = false;
  isExpanded = true;
  VERSION = VERSION;
  ROLE = ROLE;

  // Main Menu Items
  recordsItems = [
    {
      label: "Phone",
      icon: "pi pi-mobile",
      route: "/phone",
      roles: [ROLE.ADMIN, ROLE.MANAGER, ROLE.LEADER, ROLE.OFFICER],
      logDetails: "Navigated to Phone",
    },
    {
      label: "Email",
      icon: "pi pi-envelope",
      route: "/email",
      roles: [ROLE.ADMIN, ROLE.MANAGER, ROLE.LEADER, ROLE.OFFICER],
      logDetails: "Navigated to Email",
    },
    {
      label: "Activity Logs",
      icon: "pi pi-search",
      route: "/activity-logs",
      roles: [ROLE.ADMIN, ROLE.MANAGER, ROLE.LEADER],
      logDetails: "Navigated to Activity Logs",
    },
  ];

  reportsItems = [
    {
      label: "Workload Statistics",
      icon: "pi pi-chart-bar",
      route: "/workload-statistics",
      roles: [ROLE.ADMIN, ROLE.MANAGER, ROLE.LEADER],
      logDetails: "Navigated to Workload Statistics",
    },
  ];

  toolsItems = [
    {
      label: "IM Calculator",
      icon: "pi pi-calculator",
      route: "http://sbcalc.bren-inc.com/",
      roles: [ROLE.ADMIN, ROLE.MANAGER, ROLE.LEADER, ROLE.OFFICER],
      logDetails: "Navigated to IM Calculator",
    },
  ];

  settingsItems = [
    {
      label: "Profile",
      icon: "pi pi-user",
      route: "/profile",
      roles: [ROLE.ADMIN, ROLE.MANAGER, ROLE.LEADER, ROLE.OFFICER],
      logDetails: "Navigated to Profile",
    },
    {
      label: "User Management",
      icon: "pi pi-users",
      route: "/users",
      roles: [ROLE.ADMIN, ROLE.MANAGER],
      logDetails: "Navigated to User Management",
    },
    {
      label: "Product",
      icon: "pi pi-book",
      route: "/product",
      roles: [ROLE.ADMIN, ROLE.MANAGER],
      logDetails: "Navigated to Product",
    },
  ];

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.checked = this.themeService.isDarkTheme;
  }

  onLogout() {
    this.insertLog("Logged out");
    this.accountService.logout();
  }

  insertLog(detail: string) {
    const activityLog: Activitylog = {
      action: "Page Navigation",
      detail: detail,
      // pcName: getPCName(),
      addedBy: this.accountService.activeUser()?.username ?? "",
    };

    this.activityLogService.add(activityLog).subscribe();
  }

  onItemClick(route: string, logDetails: string) {
    this.sideNavService.notifyItemClicked();
    this.insertLog(logDetails);

    if (route.startsWith("http")) {
      // Open external links in a new tab
      window.open(route, "_blank");
    } else {
      // Navigate within the app
      this.router.navigate([route]);
    }

    this.visible = false; // optional
  }

  // Method to filter items based on user role
  filterItemsByRole(items: any[]) {
    const userRole = this.accountService.activeUser()?.role;
    return items.filter((item) => item.roles.includes(userRole)); //returns only item same with activeuser
  }
}
