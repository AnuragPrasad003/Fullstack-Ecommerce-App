

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { ProductDetails } from './components/product-details/product-details';
import { CartDetails } from './components/cart-details/cart-details';
import { Checkout } from './components/checkout/checkout';
import { Login } from './components/login/login';
import { MembersPage } from './components/members-page/members-page';
import { AuthGuard } from '@auth0/auth0-angular';
import { OrderHistoryComponent } from './components/order-history/order-history';


const routes: Routes = [
  
  { path: 'login', component: Login },
  { path: 'members', component: MembersPage, canActivate: [AuthGuard]},
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard]},
  { path: 'checkout', component: Checkout },
  { path: 'cart-details', component: CartDetails },
  { path: 'search/:keyword', component: ProductList },
  { path: 'category/:id', component: ProductList },
  { path: 'category', component: ProductList },
  { path: 'products/:id', component: ProductDetails },
  { path: 'products', component: ProductList },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

