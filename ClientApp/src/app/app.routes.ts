import { Routes } from "@angular/router";
import { PageLoginComponent } from "./pages/page-login/page-login.component";
import { SidenavComponent } from "./shared/components/sidenav/sidenav.component";
import { authGuard } from "./core/guards/auth.guard";
import { adminGuard } from "./core/guards/admin.guard";
import { PagePhoneComponent } from "./pages/page-phone/page-phone.component";
import { PageEmailComponent } from "./pages/page-email/page-email.component";
import { PageActivityLogComponent } from "./pages/page-activity-log/page-activity-log.component";
import { PageWorkloadStatsComponent } from "./pages/page-workload-stats/page-workload-stats.component";
import { PageProfileComponent } from "./pages/page-profile/page-profile.component";
import { PageProductComponent } from "./pages/page-product/page-product.component";
import { PageManageUsersComponent } from "./pages/page-manage-users/page-manage-users.component";
import { leaderGuard } from "./core/guards/leader.guard";

export const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: PageLoginComponent },
  {
    path: "",
    component: SidenavComponent,
    runGuardsAndResolvers: "always",
    canActivate: [authGuard],
    children: [
      { path: "phone", component: PagePhoneComponent },
      { path: "email", component: PageEmailComponent },
      {
        path: "users",
        component: PageManageUsersComponent,
        canActivate: [adminGuard],
      },
      {
        path: "activity-logs",
        component: PageActivityLogComponent,
        canActivate: [leaderGuard],
      },
      {
        path: "workload-statistics",
        component: PageWorkloadStatsComponent,
        canActivate: [leaderGuard],
      },
      { path: "profile", component: PageProfileComponent },
      {
        path: "product",
        component: PageProductComponent,
        canActivate: [adminGuard],
      },
      {
        path: "**",
        component: PagePhoneComponent,
        pathMatch: "full",
      },
    ],
  },
];
