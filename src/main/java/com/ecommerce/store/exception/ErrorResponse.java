package com.ecommerce.store.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

// The shape of every error response sent back to the frontend
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {
    private Instant timestamp;
    private int status;
    private String message;
    // Only populated on validation errors — shows which field failed and why
    private Map<String, String> fieldErrors;
}
