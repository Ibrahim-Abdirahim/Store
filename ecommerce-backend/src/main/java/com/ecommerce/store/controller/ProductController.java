package com.ecommerce.store.controller;

import com.ecommerce.store.dto.ProductResponse;
import com.ecommerce.store.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Public endpoints — anyone can browse products without logging in
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // GET /api/products — get all products (paginated)
    // GET /api/products?page=0&size=10 — get first 10 products
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    // GET /api/products/search?name=phone — search by name
    @GetMapping("/search")
    public ResponseEntity<Page<ProductResponse>> searchProducts(
            @RequestParam String name, Pageable pageable) {
        return ResponseEntity.ok(productService.searchProducts(name, pageable));
    }

    // GET /api/products/category?category=electronics — filter by category
    @GetMapping("/category")
    public ResponseEntity<Page<ProductResponse>> getByCategory(
            @RequestParam String category, Pageable pageable) {
        return ResponseEntity.ok(productService.getProductsByCategory(category, pageable));
    }

    // GET /api/products/1 — get one product by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
}
