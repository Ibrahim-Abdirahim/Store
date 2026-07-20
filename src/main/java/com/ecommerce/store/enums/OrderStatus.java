package com.ecommerce.store.enums;

// Tracks where an order is in its lifecycle
public enum OrderStatus {
    PENDING,    // just placed, waiting for confirmation
    CONFIRMED,  // store confirmed the order
    SHIPPED,    // on its way to the customer
    DELIVERED,  // customer received it
    CANCELLED   // order was cancelled
}
