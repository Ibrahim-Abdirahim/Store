package com.ecommerce.store.exception;

// Thrown when the user sends invalid or conflicting data
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
