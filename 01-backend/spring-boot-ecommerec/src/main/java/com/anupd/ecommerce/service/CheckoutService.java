package com.anupd.ecommerce.service;

import com.anupd.ecommerce.dto.Purchase;
import com.anupd.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
