package com.example.graphedu.dto;

import java.util.List;

public record ShortestPathDto(
        Long startCourseId,
        Long targetCourseId,
        int pathLength,
        List<CourseDto> pathCourses
) {}
