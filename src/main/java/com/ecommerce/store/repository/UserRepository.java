package com.ecommerce.store.repository;

import com.ecommerce.store.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find a user by their email — used during login
    Optional<User> findByEmail(String email);

    // Check if an email is already registered — used during registration
    boolean existsByEmail(String email);
}
