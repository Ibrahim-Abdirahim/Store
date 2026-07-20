package com.ecommerce.store.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which order this item belongs to
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // Which product was purchased
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // How many units were purchased
    @Column(nullable = false)
    private Integer quantity;

    // Price at the time of purchase — stored separately so future price
    // changes on the product don't affect what the customer was charged
    @Column(nullable = false)
    private BigDecimal priceAtPurchase;
}
