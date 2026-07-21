package com.ecommerce.store.controller;

import com.ecommerce.store.dto.OrderResponse;
import com.ecommerce.store.dto.ProductRequest;
import com.ecommerce.store.dto.ProductResponse;
import com.ecommerce.store.entity.User;
import com.ecommerce.store.enums.OrderStatus;
import com.ecommerce.store.enums.Role;
import com.ecommerce.store.exception.ResourceNotFoundException;
import com.ecommerce.store.repository.UserRepository;
import com.ecommerce.store.service.OrderService;
import com.ecommerce.store.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// All endpoints here are restricted to ADMIN role only (enforced in SecurityConfig)
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductService productService;
    private final OrderService orderService;
    private final UserRepository userRepository;

    // --- Product management ---

    // POST /api/admin/products — create a new product
    @PostMapping("/products")
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.createProduct(request));
    }

    // PUT /api/admin/products/1 — update an existing product
    @PutMapping("/products/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    // DELETE /api/admin/products/1 — delete a product
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // --- Order management ---

    // GET /api/admin/orders — view all orders in the system
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // PUT /api/admin/orders/1/status?status=SHIPPED — update order status
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    // --- User management ---

    // GET /api/admin/users — view all registered users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // PUT /api/admin/users/1/promote — promote a user to admin
    @PutMapping("/users/{id}/promote")
    public ResponseEntity<String> promoteToAdmin(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(Role.ADMIN);
        userRepository.save(user);
        return ResponseEntity.ok("User promoted to ADMIN successfully");
    }

    // PUT /api/admin/users/1/demote — demote an admin back to regular user
    @PutMapping("/users/{id}/demote")
    public ResponseEntity<String> demoteToUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(Role.USER);
        userRepository.save(user);
        return ResponseEntity.ok("User demoted to USER successfully");
    }
}
