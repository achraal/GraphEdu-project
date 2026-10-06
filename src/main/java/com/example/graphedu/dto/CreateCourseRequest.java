package com.example.graphedu.dto;

public record CreateCourseRequest(String title, String description, String level, Long departmentId, Long instructorId) {}