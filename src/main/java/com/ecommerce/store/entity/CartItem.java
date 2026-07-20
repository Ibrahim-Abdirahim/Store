package com.ecommerce.store.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which cart this item belongs to
    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    // Which product this item represents
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // How many units of this product the user wants
    @Column(nullable = false)
    private Integer quantity;
}
