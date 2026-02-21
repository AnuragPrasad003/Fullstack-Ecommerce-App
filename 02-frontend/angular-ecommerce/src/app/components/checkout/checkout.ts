import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Cart } from '../../services/cart';
import { APShopForm } from '../../services/apshop-form';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CheckoutService } from '../../services/checkout.service';
import { ApShopValidators } from '../../validators/ap-shop-validators';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { PaymentService } from '../../services/payment-service';



@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: Cart,
    private changeDetectorRef: ChangeDetectorRef,
    private apShopService: APShopForm,
    private checkoutService: CheckoutService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // read the user's email address from browser storage
    const theEmail = this.storage.getItem('userEmail') || '';

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required,
                                       Validators.minLength(2),
                                       ApShopValidators.notOnlyWhitespace]),

        lastName: new FormControl('',[Validators.required,
                                     Validators.minLength(2),
                                     ApShopValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail,
                              [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
        ),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',[Validators.required,
                                     Validators.minLength(2),
                                     ApShopValidators.notOnlyWhitespace]),
        city: new FormControl('',[Validators.required,
                                     Validators.minLength(2),
                                     ApShopValidators.notOnlyWhitespace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',[Validators.required,
                                     Validators.minLength(2),
                                     ApShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',[Validators.required,
                                     Validators.minLength(2),
                                     ApShopValidators.notOnlyWhitespace]),
        city: new FormControl('',[Validators.required,
                                     Validators.minLength(2),
                                     ApShopValidators.notOnlyWhitespace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',[Validators.required,
                                     Validators.minLength(2),
                                     ApShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('',[Validators.required]),
        nameOnCard: new FormControl('',[Validators.required,
                                     Validators.minLength(2),
                                     ApShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('',[Validators.required,
                                     Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',[Validators.required,
                                     Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });
    this.reviewCartDetails();
    if (this.cartService.cartItems.length === 0) {
      console.warn('Cart is empty — redirecting to products');
    }

    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: "+ startMonth);

    this.apShopService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: "+ JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card years

    this.apShopService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit cardyears: "+JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // populate countries

    this.apShopService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: "+ JSON.stringify(data));
        this.countries = data;
      }
    )

  }

  get firstName(){ return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName'); }
  get email(){ return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState(){ return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet(){ return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity(){ return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState(){ return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode(){ return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry(){ return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType(){ return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard(){ return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode(){ return this.checkoutFormGroup.get('creditCard.securityCode'); }
  

  copyShippingAddressToBillingAddress(event: Event) {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value);

        // bug fix for states
        this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // bug fix for states
      this.billingAddressStates = [];
    }
  }

  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
      this.changeDetectorRef.detectChanges();
    });

    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data;
      this.changeDetectorRef.detectChanges();
    });
  }

  handleMonthsAndYears(){

    const creditCardFormGroup = this.checkoutFormGroup.get(`creditCard`);

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // if the current year equals the selected year, then start with current month

    let startMonth : number;

    if(currentYear === selectedYear){
        startMonth = new Date().getMonth() + 1;
    }
    else{
      startMonth = 1;
    }

    this.apShopService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: "+ JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

 onSubmit() {

  if (this.checkoutFormGroup.invalid) {
    this.checkoutFormGroup.markAllAsTouched();
    return;
  }

  // 1️⃣ First create Razorpay order
  this.paymentService.createOrder(this.totalPrice * 100).subscribe(order => {

    const options = {
      key: 'rzp_test_S4fR4mtu7f1IDf',      // your Razorpay key
      amount: this.totalPrice * 100,
      currency: 'INR',
      order_id: order.id,
      name: 'Apshop Store',
      description: 'Order Payment',
      
      handler: (response: any) => {

        // 2️⃣ Only AFTER successful UPI payment → place order
        this.placeOrderAfterPayment();
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  });
}

placeOrderAfterPayment() {

  let order = new Order();
  order.totalPrice = this.totalPrice;
  order.totalQuantity = this.totalQuantity;

  const cartItems = this.cartService.cartItems;
  let orderItems: OrderItem[] =
      cartItems.map(item => new OrderItem(item));

  let purchase = new Purchase();

  purchase.customer =
    this.checkoutFormGroup.controls['customer'].value;

  purchase.shippingAddress =
    this.checkoutFormGroup.controls['shippingAddress'].value;

  purchase.billingAddress =
    this.checkoutFormGroup.controls['billingAddress'].value;

  purchase.order = order;
  purchase.orderItems = orderItems;

  this.checkoutService.placeOrder(purchase).subscribe({
    next: res => {
      alert("Payment successful! Order placed 🎉");
      this.resetCart();
    },
    error: err => alert("Order error: " + err.message)
  });
}


  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products"); 
  }

  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.apShopService.getStates(countryCode).subscribe(
      data => {
        console.log(`Retrieved states for ${formGroupName}:`, data);

        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }
        else{
          this.billingAddressStates = data;
        }

        // select first item by default
        if (formGroup && data.length > 0) {
          formGroup.get('state')?.setValue(data[0]);
        }
      }
    );
  }
}
