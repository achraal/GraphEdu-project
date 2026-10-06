package com.example.graphedu.controller;

import com.example.graphedu.dto.CourseDto;
import com.example.graphedu.dto.CreateCourseRequest;
import com.example.graphedu.dto.UpdateCourseRequest;
import com.example.graphedu.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @QueryMapping
    public List<CourseDto> getCourseCatalog(
            @Argument Long departmentId,
            @Argument Long instructorId,
            @Argument String level) {
        return courseService.getCatalog(departmentId, instructorId, level);
    }

    @MutationMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    public CourseDto createCourse(
            @Argument String title, @Argument String description,
            @Argument String level, @Argument Long departmentId,
            @Argument Long instructorId) {
        return courseService.createCourse(new CreateCourseRequest(title, description, level, departmentId, instructorId));
    }

    @MutationMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    public CourseDto updateCourse(
            @Argument Long id, @Argument String title,
            @Argument String description, @Argument String level) {
        return courseService.updateCourse(new UpdateCourseRequest(id, title, description, level));
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public boolean archiveCourse(@Argument Long id) {
        return courseService.archiveCourse(id);
    }

    @MutationMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    public CourseDto addCoursePrerequisite(@Argument Long courseId, @Argument Long prerequisiteId) {
        return courseService.addPrerequisite(courseId, prerequisiteId);
    }
}
