package com.anupd.ecommerce.controller;

import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import com.razorpay.Order;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin("https://localhost:4200")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @PostMapping("/create-order")
    public String createOrder(@RequestBody Map<String, Object> data) throws Exception {

        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject options = new JSONObject();
        //options.put("amount", data.get("amount")); // in paise
        options.put("amount", ((Number) data.get("amount")).intValue());
        options.put("currency", "INR");
        options.put("receipt", "order_rcpt_" + System.currentTimeMillis());

        Order order = client.orders.create(options);

        return order.toString();   // contains order.id
    }
}

