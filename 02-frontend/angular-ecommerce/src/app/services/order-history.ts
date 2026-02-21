import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {

  private orderUrl = environment.apshopApiUrl + '/orders';

  constructor(private httpClient: HttpClient){}

 getOrderHistory(email: string): Observable<OrderHistory[]> {

  const orderHistoryUrl =
    `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`;

  return this.httpClient
    .get<GetResponseOrderHistory>(orderHistoryUrl)
    .pipe(map(response => response._embedded.orders));
}

  
}

interface GetResponseOrderHistory{
  _embedded:{
    orders: OrderHistory[];
  }
}