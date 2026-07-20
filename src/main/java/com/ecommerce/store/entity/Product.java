package com.ecommerce.store.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Product name — required
    @Column(nullable = false)
    private String name;

    // Optional longer description of the product
    @Column(length = 2000)
    private String description;

    // Using BigDecimal for money — avoids floating point rounding errors
    @Column(nullable = false)
    private BigDecimal price;

    // How many units are available in stock
    @Column(nullable = false)
    private Integer stockQuantity;

    // Optional URL pointing to the product image
    private String imageUrl;

    // e.g. "Electronics", "Clothing", "Books"
    private String category;

    @Column(updatable = false)
    private Instant createdAt;

    private Instant updatedAt;

    // Automatically set timestamps on create and update
    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
