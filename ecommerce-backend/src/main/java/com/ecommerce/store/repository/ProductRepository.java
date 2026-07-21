package com.ecommerce.store.repository;

import com.ecommerce.store.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Spring Data JPA auto-implements these from the method name alone
    Page<Product> findByCategoryIgnoreCase(String category, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
