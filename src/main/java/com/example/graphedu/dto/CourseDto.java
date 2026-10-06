package com.example.graphedu.dto;

import java.util.List;

public record CourseDto(
        Long id,
        String title,
        String description,
        String level,
        boolean archived,
        DepartmentDto department,
        UserDto instructor,
        List<CourseSummaryDto> prerequisites
) {}
