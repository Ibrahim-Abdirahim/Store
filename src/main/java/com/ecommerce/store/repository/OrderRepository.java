package com.ecommerce.store.repository;

import com.ecommerce.store.entity.Order;
import com.ecommerce.store.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Get all orders for a specific user, newest first
    List<Order> findByUserOrderByCreatedAtDesc(User user);
}
