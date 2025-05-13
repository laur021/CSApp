import { HttpInterceptorFn } from '@angular/common/http';
import { AccountService } from '../services/account/account.service';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);

  if (accountService.activeUser()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accountService.activeUser()?.accessToken}`,
      },
    });
  }

  return next(req);
};
