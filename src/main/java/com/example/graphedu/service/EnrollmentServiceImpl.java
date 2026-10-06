package com.example.graphedu.service;

import com.example.graphedu.dto.CourseDto;
import com.example.graphedu.dto.EnrollmentDto;
import com.example.graphedu.dto.PathwayDto;
import com.example.graphedu.model.Course;
import com.example.graphedu.model.Enrollment;
import com.example.graphedu.model.User;
import com.example.graphedu.repository.CourseRepository;
import com.example.graphedu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    // Remarque : Injecter un composant de mapping si possible (ex: un CourseMapper)
    // Ici on suppose l'existence d'une méthode de mapping utilitaire mapToCourseDto()

    @Override
    @Transactional
    public boolean enrollStudent(Long studentId, Long courseId) {
        // 1. Contrôle intelligent : vérification des prérequis via Cypher
        List<Course> missingPrereqs = courseRepository.findMissingPrerequisites(studentId, courseId);
        if (!missingPrereqs.isEmpty()) {
            String missingNames = missingPrereqs.stream()
                    .map(Course::getTitle)
                    .collect(Collectors.joining(", "));
            throw new RuntimeException("Inscription refusée. Vous devez d'abord valider : " + missingNames);
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Étudiant introuvable"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Cours introuvable"));

        // 2. Vérifier si déjà inscrit
        boolean alreadyEnrolled = student.getEnrollments().stream()
                .anyMatch(e -> e.getCourse().getId().equals(courseId));
        if (alreadyEnrolled) {
            throw new RuntimeException("Vous êtes déjà inscrit à ce cours.");
        }

        // 3. Création de la relation
        Enrollment enrollment = new Enrollment();
        enrollment.setCourse(course);
        enrollment.setDate(LocalDate.now());
        enrollment.setStatus("IN_PROGRESS");

        student.getEnrollments().add(enrollment);
        userRepository.save(student);

        return true;
    }

    @Override
    public PathwayDto getStudentPathway(Long studentId, Long departmentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Étudiant introuvable"));
        List<Course> departmentCourses = courseRepository.findByDepartmentId(departmentId);

        // Récupérer les IDs des cours où l'étudiant est inscrit (peu importe le statut)
        List<Long> takenCourseIds = student.getEnrollments().stream()
                .map(e -> e.getCourse().getId())
                .toList();

        // Séparation logique
        List<CourseDto> taken = departmentCourses.stream()
                .filter(c -> takenCourseIds.contains(c.getId()))
                .map(this::mapToCourseDto) // Remplacer par votre mapper
                .toList();

        List<CourseDto> remaining = departmentCourses.stream()
                .filter(c -> !takenCourseIds.contains(c.getId()))
                .map(this::mapToCourseDto) // Remplacer par votre mapper
                .toList();

        return new PathwayDto(taken, remaining);
    }

    @Override
    public List<EnrollmentDto> getStudentEnrollments(Long studentId) {
        return userRepository.findById(studentId)
                .map(student -> student.getEnrollments().stream()
                        .map(e -> new EnrollmentDto(
                                e.getId(),
                                e.getDate() != null ? e.getDate().toString() : null,
                                e.getStatus(),
                                mapToCourseDto(e.getCourse())))
                        .toList())
                .orElse(List.of());
    }

    private CourseDto mapToCourseDto(Course course) {
        // Implémentation simplifiée, à factoriser idéalement avec le CourseServiceImpl
        return new CourseDto(course.getId(), course.getTitle(), course.getDescription(),
                course.getLevel(), course.isArchived(), null, null, List.of());
    }
}
