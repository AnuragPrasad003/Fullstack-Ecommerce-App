import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { Cart } from '../../services/cart';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css'],
})
export class ProductDetails implements OnInit {

  product: Product | undefined;
  loading = true;
  error = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: Cart,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      console.log('Product ID from route:', id);
      if (id) {
        this.handleProductDetails(+id);
      }
    });
  }

  handleProductDetails(theProductId: number) {
    this.loading = true;
    this.error = '';
    console.log('Fetching product with ID:', theProductId);
    
    this.productService.getProduct(theProductId).subscribe({
      next: (data) => {
        console.log('Product loaded successfully:', data);
        this.product = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.error = 'Failed to load product. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

 addToCart() {
  if (!this.product) {
    console.error('Product is not loaded yet');
    return;
  }

  console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);

  const theCartItem = new CartItem(this.product);
  this.cartService.addToCart(theCartItem);
}


}


