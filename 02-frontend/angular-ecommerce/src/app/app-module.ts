import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ProductList } from './components/product-list/product-list';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ProductService } from './services/product.service'
import { ProductCategoryMenu } from './components/product-category-menu/product-category-menu';
import { Search } from './components/search/search';
import { ProductDetails } from './components/product-details/product-details';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardStatus } from './components/card-status/card-status';
import { CartDetails } from './components/cart-details/cart-details';
import { RouterModule, Routes } from '@angular/router';
import { Checkout } from './components/checkout/checkout';
import { ReactiveFormsModule } from '@angular/forms';
import { Login } from './components/login/login';
import { LoginStatus } from './components/login-status/login-status';

import { AuthModule } from '@auth0/auth0-angular';
import myAppConfig from './config/my-app-config';
import { MembersPage } from './components/members-page/members-page';
import {  OrderHistoryComponent } from './components/order-history/order-history';
import { AuthInterceptorService } from './services/auth-interceptor-service';


const routes: Routes = [{ path: 'cart-details', component: CartDetails }];

@NgModule({
  declarations: [ 
    App,
    ProductList,
    ProductCategoryMenu,
    Search,
    ProductDetails,
    CardStatus,
    CartDetails,
    Checkout,
    LoginStatus,
    MembersPage,
    OrderHistoryComponent
    
  ],
  imports: [
    NgbModule,
    BrowserModule,
    CommonModule,
    HttpClientModule,
     AppRoutingModule,
     ReactiveFormsModule,

     AuthModule.forRoot({
      domain: myAppConfig.oidc.domain,
      clientId: myAppConfig.oidc.clientId,
      authorizationParams: {
        redirect_uri: 'https://localhost:4200',
        audience: myAppConfig.oidc.audience
      }
    })
     
  ],
  providers: [ProductService,provideBrowserGlobalErrorListeners(),{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }
  ],
  bootstrap: [App]
})
export class AppModule { }
