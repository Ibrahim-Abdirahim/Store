package com.ecommerce.store.service;

import com.ecommerce.store.dto.OrderResponse;
import com.ecommerce.store.entity.*;
import com.ecommerce.store.enums.OrderStatus;
import com.ecommerce.store.exception.BadRequestException;
import com.ecommerce.store.exception.ResourceNotFoundException;
import com.ecommerce.store.repository.CartRepository;
import com.ecommerce.store.repository.OrderRepository;
import com.ecommerce.store.repository.ProductRepository;
import com.ecommerce.store.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // Checkout: convert the user's cart into a placed order
    @Transactional
    public OrderResponse checkout(String email) {
        User user = getUser(email);
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Your cart is empty");
        }

        // Build the order
        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .totalAmount(BigDecimal.ZERO)
                .build();

        // Convert each cart item into an order item
        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            Product product = cartItem.getProduct();

            // Check stock is still available at checkout time
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException("Not enough stock for: " + product.getName());
            }

            // Reduce stock by the purchased quantity
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            return OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .priceAtPurchase(product.getPrice()) // snapshot the price right now
                    .build();
        }).toList();

        order.setOrderItems(orderItems);

        // Calculate the total from the snapshotted prices
        BigDecimal total = orderItems.stream()
                .map(item -> item.getPriceAtPurchase()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(total);
        orderRepository.save(order);

        // Clear the cart after successful checkout
        cart.getItems().clear();
        cartRepository.save(cart);

        return toResponse(order);
    }

    // Get all orders for the current user
    public List<OrderResponse> getMyOrders(String email) {
        User user = getUser(email);
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::toResponse).toList();
    }

    // Get a specific order by ID — user can only see their own orders
    public OrderResponse getOrderById(Long orderId, String email) {
        User user = getUser(email);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You don't have access to this order");
        }

        return toResponse(order);
    }

    // Admin: get all orders in the system
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream().map(this::toResponse).toList();
    }

    // Admin: update an order's status (e.g. mark as SHIPPED)
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(newStatus);
        return toResponse(orderRepository.save(order));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // Convert Order entity to OrderResponse DTO
    private OrderResponse toResponse(Order order) {
        List<OrderResponse.OrderItemResponse> items = order.getOrderItems().stream()
                .map(item -> OrderResponse.OrderItemResponse.builder()
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .priceAtPurchase(item.getPriceAtPurchase())
                        .subtotal(item.getPriceAtPurchase()
                                .multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build())
                .toList();

        return OrderResponse.builder()
                .orderId(order.getId())
                .status(order.getStatus().name())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }
}
