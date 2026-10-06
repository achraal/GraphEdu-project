package com.example.graphedu.service;

import com.example.graphedu.dto.CourseDto;
import com.example.graphedu.dto.CreateCourseRequest;
import com.example.graphedu.dto.UpdateCourseRequest;
import java.util.List;

public interface CourseService {
    CourseDto createCourse(CreateCourseRequest request);
    CourseDto updateCourse(UpdateCourseRequest request);
    boolean archiveCourse(Long courseId);
    CourseDto addPrerequisite(Long courseId, Long prerequisiteId);
    List<CourseDto> getCatalog(Long departmentId, Long instructorId, String level);
}
