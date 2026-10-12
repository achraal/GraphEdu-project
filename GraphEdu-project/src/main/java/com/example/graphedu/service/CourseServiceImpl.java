package com.example.graphedu.service;

import com.example.graphedu.dto.*;
import com.example.graphedu.model.Course;
import com.example.graphedu.model.Department;
import com.example.graphedu.model.User;
import com.example.graphedu.repository.CourseRepository;
import com.example.graphedu.repository.DepartmentRepository;
import com.example.graphedu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CourseDto createCourse(CreateCourseRequest request) {
        Course course = new Course();
        course.setTitle(request.title());
        course.setDescription(request.description());
        course.setLevel(request.level());

        Department dept = departmentRepository.findById(request.departmentId())
                .orElseThrow(() -> new RuntimeException("Département introuvable"));
        course.setDepartment(dept);

        User instructor = userRepository.findById(request.instructorId())
                .orElseThrow(() -> new RuntimeException("Instructeur introuvable"));
        course.setInstructor(instructor);

        return mapToDto(courseRepository.save(course));
    }

    @Override
    @Transactional
    public CourseDto updateCourse(UpdateCourseRequest request) {
        Course course = courseRepository.findById(request.id())
                .orElseThrow(() -> new RuntimeException("Cours introuvable"));

        if (request.title() != null) course.setTitle(request.title());
        if (request.description() != null) course.setDescription(request.description());
        if (request.level() != null) course.setLevel(request.level());

        return mapToDto(courseRepository.save(course));
    }

    @Override
    @Transactional
    public boolean archiveCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Cours introuvable"));
        course.setArchived(true);
        courseRepository.save(course);
        return true;
    }

    @Override
    @Transactional
    public CourseDto addPrerequisite(Long courseId, Long prerequisiteId) {
        if (courseId.equals(prerequisiteId)) {
            throw new IllegalArgumentException("Un cours ne peut pas être son propre prérequis");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Cours principal introuvable"));
        Course prerequisite = courseRepository.findById(prerequisiteId)
                .orElseThrow(() -> new RuntimeException("Cours prérequis introuvable"));

        course.getPrerequisites().add(prerequisite);
        return mapToDto(courseRepository.save(course));
    }

    @Override
    public List<CourseDto> getCatalog(Long departmentId, Long instructorId, String level) {
        return courseRepository.findFilteredCourses(departmentId, instructorId, level)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Mapping centralisé
    private CourseDto mapToDto(Course course) {
        DepartmentDto deptDto = course.getDepartment() != null ?
                new DepartmentDto(course.getDepartment().getId(), course.getDepartment().getName()) : null;

        UserDto instDto = course.getInstructor() != null ?
                new UserDto(course.getInstructor().getId(), course.getInstructor().getEmail(), course.getInstructor().getName(), course.getInstructor().getRole().name()) : null;

        List<CourseSummaryDto> prereqs = course.getPrerequisites().stream()
                .map(p -> new CourseSummaryDto(p.getId(), p.getTitle(), p.getLevel()))
                .toList();

        return new CourseDto(course.getId(), course.getTitle(), course.getDescription(),
                course.getLevel(), course.isArchived(), deptDto, instDto, prereqs);
    }
}
