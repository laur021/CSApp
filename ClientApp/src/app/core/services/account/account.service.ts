import { inject, Injectable, signal } from '@angular/core';
import {
  Account,
  LoginRequest,
  LoginResponse,
  ResetPassword,
} from '../../models/account.models';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_ENDPOINTS } from '../../constants/endpoints';
import { map, Observable } from 'rxjs';
import { PagedResult } from '../../models/page-result.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  activeUser = signal<LoginResponse | null>(null);
  // pageSize: number = 10; - inalis ko yung default pagesize kasi need ko yung complete list sa entry form ng transaction

  login(obj: LoginRequest) {
    return this.http.post<LoginResponse>(API_ENDPOINTS.ACCOUNT.LOGIN, obj).pipe(
      map((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  getCurrentUser(): Observable<LoginResponse> {
    return this.http.get<LoginResponse>(API_ENDPOINTS.ACCOUNT.REFRESH);
  }

  getAll(
    skip: number = 0,
    pageSize?: number,
    searchQuery?: string
  ): Observable<PagedResult<Account>> {
    let params = new HttpParams().set('skip', skip.toString());

    if (pageSize !== undefined) {
      params = params.set('pageSize', pageSize.toString());
    }

    if (searchQuery) {
      params = params.set('search', searchQuery);
    }

    return this.http.get<PagedResult<Account>>(API_ENDPOINTS.ACCOUNT.GET_ALL, {
      params,
    });
  }

  get(id: number): Observable<Account> {
    return this.http.get<Account>(API_ENDPOINTS.ACCOUNT.GET_BY_ID(id));
  }

  add(account: Account): Observable<Account> {
    return this.http.post<Account>(API_ENDPOINTS.ACCOUNT.REGISTER, account);
  }

  updateDetails(id: number, updatedAccount: Account): Observable<Account> {
    return this.http.put<Account>(
      API_ENDPOINTS.ACCOUNT.UPDATE_DETAILS(id),
      updatedAccount
    );
  }

  updatePassword(id: number, newPassword: ResetPassword): Observable<Account> {
    return this.http.put<Account>(
      API_ENDPOINTS.ACCOUNT.UPDATE_PASSWORD(id),
      newPassword
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.ACCOUNT.DELETE(id));
  }

  logout() {
    localStorage.removeItem('user');
    this.activeUser.set(null);
    this.router.navigateByUrl('/login');
  }

  setCurrentUser(user: LoginResponse | null) {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      this.activeUser.set(user);
      this.autoLogout(this.activeUser()?.expiresIn);
    } else {
      localStorage.removeItem('user');
      this.activeUser.set(null);
    }
  }

  autoLogout(expiry: number | undefined) {
    const expiresIn = expiry ?? 0;
    setTimeout(() => {
      this.logout();
      alert('Your session has expired. Please log in again.');
    }, expiresIn * 1000);
  }

  loadUserFromLocalStorage() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user: LoginResponse = JSON.parse(userString);
      this.activeUser.set(user);
    }
  }
}
