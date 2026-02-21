import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OrderHistoryService } from '../../services/order-history';
import { OrderHistory } from '../../common/order-history';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-order-history',
  standalone: false,
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistoryComponent implements OnInit{

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService,
              private cdr: ChangeDetectorRef,private auth: AuthService
  ){}


// ngOnInit() {
//   this.auth.isAuthenticated$.subscribe(isAuth => {
//     if (isAuth) {
//       this.auth.getAccessTokenSilently().subscribe(() => {
//         this.auth.user$.subscribe(user => {
//           if (user?.email) {
//             console.log('Loading orders for:', user.email);
//             this.loadOrders(user.email);
//           }
//         });
//       });
//     }
//   });
// }

ngOnInit() {

  this.auth.user$.subscribe(user => {
    if (user?.email) {
      console.log('Loading orders for:', user.email);
      this.loadOrders(user.email);
    }
  });

}




loadOrders(email: string) {
  this.orderHistoryService.getOrderHistory(email).subscribe({
    next: orders => {
      console.log('Orders received:', orders);
      this.orderHistoryList = orders;
      this.cdr.detectChanges();
    },
    error: err => console.error('Order API failed:', err)
  });
}



}
