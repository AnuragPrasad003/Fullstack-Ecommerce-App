import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../common/product';
import { map, catchError } from 'rxjs/operators'
import { ProductCategory } from '../common/product-category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
 

private baseUrl = environment.apshopApiUrl + '/products';

private categoryUrl = environment.apshopApiUrl + '/product-category';

  constructor(private httpClient: HttpClient){

  }

    
 getProductListPaginate(thePage: number,
                        thePageSize: number,
                        theCategoryId: number): Observable<GetResponseProducts> {

//  need to build URL based on category id, page and size
const searchUrl=`${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                + `&page=${thePage}&size=${thePageSize}`;
 
  return this.httpClient.get<GetResponseProducts>(searchUrl);
}


  
 getProductList(theCategoryId: number): Observable<Product[]> {

//  need to build URL based on category id 
const searchUrl=`${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
 
  return this.getProducts(searchUrl);
}

searchProducts(theKeyword: string): Observable<Product[]> {

  //  need to build URL based on the keyword
    const searchUrl=`${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

  return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number,
                        thePageSize: number,
                        theKeyword: string): Observable<GetResponseProducts> {

//  need to build URL based on keyword, page and size
const searchUrl=`${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                + `&page=${thePage}&size=${thePageSize}`;
 
  return this.httpClient.get<GetResponseProducts>(searchUrl);
}


  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<any>(searchUrl).pipe(
      map((response: any) => {
        console.log('API RESPONSE:', response);
        if (response?._embedded?.products) {
          return response._embedded.products as Product[];
        }
        if (Array.isArray(response)) {
          return response as Product[];
        }
        if (response?.content) {
          return response.content as Product[];
        }
        return [] as Product[];
      }),
      catchError(err => {
        console.error('Failed to load products', err);
        return of([] as Product[]);
      })
    );
  }

getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl).pipe(
      map((response: any) => {
        console.log('Product API Response:', response);
        return response as Product;
      }),
      catchError(err => {
        console.error('Failed to load product with ID ' + theProductId, err);
        throw err;
      })
    );
  }

 getProductCategories(): Observable<ProductCategory[]> {
     return this.httpClient.get<any>(this.categoryUrl).pipe(
      map((response: any) => {
        console.log('API RESPONSE:', response);
        if (response?._embedded?.productCategory) {
          return response._embedded.productCategory as ProductCategory[];
        }
        if (Array.isArray(response)) {
          return response as ProductCategory[];
        }
        if (response?.content) {
          return response.content as ProductCategory[];
        }
        return [] as ProductCategory[];
      }),
      catchError(err => {
        console.error('Failed to load product categories', err);
        return of([] as ProductCategory[]);
      })
    );
  }
}

// interface GetResponseProducts {
//   _embedded: {
//     products: Product[];
//   },
//   page: {
//     size: number,
//     totalElements: number,
//     totalPages: number,
//     number:number
//   }
// }

interface GetResponseProducts {
  content: Product[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}




interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}