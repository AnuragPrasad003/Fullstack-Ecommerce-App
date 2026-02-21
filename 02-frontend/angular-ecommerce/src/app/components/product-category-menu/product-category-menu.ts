import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/product.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-category-menu',
  standalone: false, 
  templateUrl: './product-category-menu.html',
  styleUrl: './product-category-menu.css',
})
export class ProductCategoryMenu implements OnInit{

  productCategories: ProductCategory[] = [];

  constructor(private productService: ProductService ,private cdr: ChangeDetectorRef){}

  ngOnInit(){
    this.listProductCategories();
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        console.log('Product Categories='+JSON.stringify(data));
        this.productCategories=data;
        this.cdr.detectChanges();

      }
    );
  }
}

// import { Component } from '@angular/core';
// import { Observable } from 'rxjs';
// import { ProductCategory } from '../../common/product-category';
// import { ProductService } from '../../services/product.service';

// @Component({
//   selector: 'app-product-category-menu',
//   templateUrl: './product-category-menu.html',
//    standalone: true,
//   styleUrl: './product-category-menu.css'
// })
// export class ProductCategoryMenu {

//   // 👇 THIS WAS MISSING
//   productCategories$: Observable<ProductCategory[]>;

//   constructor(private productService: ProductService) {
//     this.productCategories$ = this.productService.getProductCategories();
//   }

//   // 👇 THIS WAS MISSING
//   trackById(index: number, item: ProductCategory): number {
//     return item.id;
//   }
// }
