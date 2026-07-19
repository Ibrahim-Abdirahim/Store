package com.ecommerce.store.entity;

import com.ecommerce.store.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user's display name
    @Column(nullable = false)
    private String fullName;

    // Used as the login username — must be unique across all accounts
    @Column(nullable = false, unique = true)
    private String email;

    // Stored as a BCrypt hash — never stored as plain text
    @Column(nullable = false)
    private String password;

    // Stored as a string in the DB e.g. "USER" or "ADMIN"
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(updatable = false)
    private Instant createdAt;

    // Automatically set the timestamp and default role when a new user is saved
    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        if (role == null) {
            role = Role.USER;
        }
    }

    // --- Spring Security requires these methods to understand who this user is ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Spring Security expects roles prefixed with "ROLE_" e.g. ROLE_ADMIN
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        // We use email as the unique identifier instead of a separate username field
        return email;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}
