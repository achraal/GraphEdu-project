package com.example.graphedu.controller;

import com.example.graphedu.dto.AuthResponse;
import com.example.graphedu.dto.LoginRequest;
import com.example.graphedu.dto.RegisterRequest;
import com.example.graphedu.dto.UserDto;
import com.example.graphedu.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @MutationMapping
    public AuthResponse register(@Argument String email, @Argument String password,
                                 @Argument String name, @Argument String role) {
        RegisterRequest request = new RegisterRequest(email, password, name, role);
        return authService.register(request);
    }

    @MutationMapping
    public AuthResponse login(@Argument String email, @Argument String password) {
        LoginRequest request = new LoginRequest(email, password);
        return authService.login(request);
    }

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public UserDto me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authService.getMe(authentication.getName());
    }
}