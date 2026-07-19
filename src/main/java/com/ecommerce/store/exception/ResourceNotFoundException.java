package com.ecommerce.store.exception;

// Thrown when something can't be found in the database
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
