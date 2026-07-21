package com.ecommerce.store.service;

import com.ecommerce.store.dto.AuthResponse;
import com.ecommerce.store.dto.LoginRequest;
import com.ecommerce.store.dto.RegisterRequest;
import com.ecommerce.store.entity.User;
import com.ecommerce.store.enums.Role;
import com.ecommerce.store.exception.BadRequestException;
import com.ecommerce.store.repository.UserRepository;
import com.ecommerce.store.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // never store plain text
                .role(Role.USER) // everyone who self-registers is a regular user
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return toAuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        // This throws AuthenticationException automatically if credentials are wrong
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        String token = jwtService.generateToken(user);
        return toAuthResponse(user, token);
    }

    private AuthResponse toAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
