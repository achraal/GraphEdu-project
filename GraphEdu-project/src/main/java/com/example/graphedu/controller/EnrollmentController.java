package com.example.graphedu.controller;

import com.example.graphedu.dto.EnrollmentDto;
import com.example.graphedu.dto.PathwayDto;
import com.example.graphedu.dto.UserDto;
import com.example.graphedu.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @MutationMapping
    @PreAuthorize("hasRole('STUDENT')")
    public Boolean enrollStudentInCourse(@Argument Long studentId, @Argument Long courseId) {
        // En conditions réelles, on récupère le studentId via le token JWT de l'utilisateur connecté
        return enrollmentService.enrollStudent(studentId, courseId);
    }

    @QueryMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public PathwayDto getStudentPathway(@Argument Long studentId, @Argument Long departmentId) {
        return enrollmentService.getStudentPathway(studentId, departmentId);
    }

    // Résout le champ User.enrollments déclaré dans le schéma
    @SchemaMapping(typeName = "User", field = "enrollments")
    public List<EnrollmentDto> enrollments(UserDto user) {
        return enrollmentService.getStudentEnrollments(user.id());
    }
}
