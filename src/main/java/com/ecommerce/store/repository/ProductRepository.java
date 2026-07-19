package com.ecommerce.store.repository;

import com.ecommerce.store.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

// Handles all database operations for the products table
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Filter products by category — used for category browsing
    Page<Product> findByCategoryIgnoreCase(String category, Pageable pageable);

    // Search products by name — used for the search bar
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // Get a distinct list of all categories — used to populate the category dropdown
    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL ORDER BY p.category")
    List<String> findAllDistinctCategories();
}
