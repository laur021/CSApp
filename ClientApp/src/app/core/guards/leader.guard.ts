import { CanActivateFn, Router } from "@angular/router";
import { AccountService } from "../services/account/account.service";
import { inject } from "@angular/core";
import { MessageService } from "primeng/api";
import { catchError, map, of } from "rxjs";
import { ROLE } from "../constants/role";

export const leaderGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  return accountService.getCurrentUser().pipe(
    map((res) => {
      if (
        res?.role === ROLE.ADMIN ||
        res?.role === ROLE.MANAGER ||
        res?.role === ROLE.LEADER
      ) {
        return true;
      } else {
        messageService.add({
          severity: "error",
          summary: "Unauthorized",
          detail: "You are unauthorized to access this page.",
          life: 3000,
        });

        router.navigate(["/phone"]);
        return false;
      }
    }),
    catchError(() => {
      messageService.add({
        severity: "error",
        summary: "Unauthorized",
        detail: "Failed to fetch data. Redirecting to login.",
        life: 3000,
      });
      router.navigate(["/login"]);
      return of(false);
    })
  );
};
