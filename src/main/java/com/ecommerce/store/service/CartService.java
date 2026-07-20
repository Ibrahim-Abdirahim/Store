package com.ecommerce.store.service;

import com.ecommerce.store.dto.CartItemRequest;
import com.ecommerce.store.dto.CartResponse;
import com.ecommerce.store.dto.UpdateCartItemRequest;
import com.ecommerce.store.entity.Cart;
import com.ecommerce.store.entity.CartItem;
import com.ecommerce.store.entity.Product;
import com.ecommerce.store.entity.User;
import com.ecommerce.store.exception.BadRequestException;
import com.ecommerce.store.exception.ResourceNotFoundException;
import com.ecommerce.store.repository.CartRepository;
import com.ecommerce.store.repository.ProductRepository;
import com.ecommerce.store.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // Get the current user's cart — creates one automatically if they don't have one yet
    public CartResponse getCart(String email) {
        User user = getUser(email);
        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
        return toResponse(cart);
    }

    // Add a product to the cart — if it's already there, increase the quantity
    @Transactional
    public CartResponse addItem(String email, CartItemRequest request) {
        User user = getUser(email);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Make sure there's enough stock before adding
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Not enough stock available");
        }

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));

        // Check if this product is already in the cart
        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            // Product already in cart — just increase the quantity
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
        } else {
            // New product — add it as a new cart item
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(newItem);
        }

        return toResponse(cartRepository.save(cart));
    }

    // Update the quantity of a specific cart item
    @Transactional
    public CartResponse updateItemQuantity(String email, Long cartItemId, UpdateCartItemRequest request) {
        User user = getUser(email);
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        // Check the requested quantity doesn't exceed available stock
        if (item.getProduct().getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Not enough stock available");
        }

        item.setQuantity(request.getQuantity());
        return toResponse(cartRepository.save(cart));
    }

    // Remove a specific item from the cart entirely
    @Transactional
    public CartResponse removeItem(String email, Long cartItemId) {
        User user = getUser(email);
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        cart.getItems().removeIf(item -> item.getId().equals(cartItemId));
        return toResponse(cartRepository.save(cart));
    }

    // Empty the entire cart at once
    @Transactional
    public void clearCart(String email) {
        User user = getUser(email);
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    // Load a user from the database by their email
    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // Convert Cart entity to CartResponse DTO including calculated totals
    private CartResponse toResponse(Cart cart) {
        List<CartResponse.CartItemResponse> itemResponses = cart.getItems().stream()
                .map(item -> CartResponse.CartItemResponse.builder()
                        .cartItemId(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .imageUrl(item.getProduct().getImageUrl())
                        .price(item.getProduct().getPrice())
                        .quantity(item.getQuantity())
                        .subtotal(item.getProduct().getPrice()
                                .multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build())
                .toList();

        // Sum all subtotals to get the cart total
        BigDecimal total = itemResponses.stream()
                .map(CartResponse.CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(itemResponses)
                .totalPrice(total)
                .build();
    }
}
