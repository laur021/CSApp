import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PagedResult } from '../../models/page-result.model';
import { Observable } from 'rxjs';
import { Transaction, TransactionWrite } from '../../models/transaction.models';
import { API_ENDPOINTS } from '../../constants/endpoints';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  pageSize: number = 10;

  getPaginatedList(
    skip: number = 0,
    type?: string,
    customer?: string,
    fromDate?: string,
    toDate?: string,
    searchQuery?: string
  ): Observable<PagedResult<Transaction>> {
    let paramsMap = new Map<string, string>();

    paramsMap.set('skip', skip.toString());
    paramsMap.set('pageSize', this.pageSize.toString());

    if (type) paramsMap.set('transactionType', type);

    if (customer) paramsMap.set('Customer', customer);

    if (fromDate && toDate) {
      paramsMap.set('fromDate', fromDate);
      paramsMap.set('toDate', toDate);
    }

    if (searchQuery) paramsMap.set('search', searchQuery);

    let params = new HttpParams({ fromObject: Object.fromEntries(paramsMap) });

    return this.http.get<PagedResult<Transaction>>(
      API_ENDPOINTS.TRANSACTIONS.GET_PAGINATED_LIST,
      { params }
    );
  }

  getList(
    type?: string,
    customer?: string,
    fromDate?: string,
    toDate?: string,
    searchQuery?: string
  ): Observable<Transaction[]> {
    let paramsMap = new Map<string, string>();

    paramsMap.set('pageSize', this.pageSize.toString());

    if (type) paramsMap.set('transactionType', type);

    if (customer) paramsMap.set('Customer', customer);

    if (fromDate && toDate) {
      paramsMap.set('fromDate', fromDate);
      paramsMap.set('toDate', toDate);
    }

    if (searchQuery) paramsMap.set('search', searchQuery);

    let params = new HttpParams({ fromObject: Object.fromEntries(paramsMap) });

    return this.http.get<Transaction[]>(API_ENDPOINTS.TRANSACTIONS.GET_LIST, {
      params,
    });
  }

  add(transaction: TransactionWrite): Observable<TransactionWrite> {
    return this.http.post<TransactionWrite>(
      API_ENDPOINTS.TRANSACTIONS.ADD,
      transaction
    );
  }

  update(
    transactionId: string,
    transToBeUpdate: TransactionWrite
  ): Observable<TransactionWrite> {
    return this.http.put<TransactionWrite>(
      API_ENDPOINTS.TRANSACTIONS.UPDATE(transactionId),
      transToBeUpdate
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.TRANSACTIONS.DELETE(id));
  }
}
