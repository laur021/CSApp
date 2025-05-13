import { CanActivateFn, Router } from "@angular/router";
import { AccountService } from "../services/account/account.service";
import { inject } from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  if (accountService.activeUser()) {
    return true;
  } else {
    alert("You are unauthorized to access the page.");
    router.navigate(["/login"]);
    return false;
  }
};
