package com.example.graphedu.dto;

public record UpdateUserRequest(Long id, String name, String email, String role) {}