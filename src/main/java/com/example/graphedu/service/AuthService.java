package com.example.graphedu.service;

import com.example.graphedu.dto.AuthResponse;
import com.example.graphedu.dto.LoginRequest;
import com.example.graphedu.dto.RegisterRequest;
import com.example.graphedu.dto.UserDto;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserDto getMe(String email);
}