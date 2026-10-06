package com.example.graphedu.dto;

import java.util.List;

public record PathwayDto(
        List<CourseDto> takenCourses,
        List<CourseDto> remainingCourses
) {}